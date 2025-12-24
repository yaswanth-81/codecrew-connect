import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestCase {
  input: Record<string, unknown>;
  expected: unknown;
}

interface EvaluationRequest {
  code: string;
  language: 'javascript' | 'python' | 'java' | 'c';
  testCases: TestCase[];
  functionName?: string;
}

// Simple code evaluator - evaluates JavaScript code
// For Python/Java/C, we'll simulate the evaluation based on test case matching
const evaluateCode = (code: string, language: string, testCases: TestCase[], functionName?: string): { passed: number; total: number; results: { passed: boolean; input: unknown; expected: unknown; actual: unknown; error?: string }[] } => {
  const results: { passed: boolean; input: unknown; expected: unknown; actual: unknown; error?: string }[] = [];
  let passed = 0;
  
  console.log(`Evaluating ${language} code with ${testCases.length} test cases`);
  
  for (const tc of testCases) {
    try {
      let actual: unknown;
      
      if (language === 'javascript') {
        // Extract function name from code if not provided
        const funcMatch = code.match(/function\s+(\w+)/);
        const fnName = functionName || (funcMatch ? funcMatch[1] : null);
        
        if (!fnName) {
          results.push({ passed: false, input: tc.input, expected: tc.expected, actual: null, error: 'Could not find function name' });
          continue;
        }
        
        // Create evaluation code
        const evalCode = `
          ${code}
          ${fnName}(${Object.values(tc.input).map(v => JSON.stringify(v)).join(', ')})
        `;
        
        // Note: In production, use a proper sandbox. This is for demonstration.
        actual = new Function(`return ${evalCode}`)();
      } else {
        // For other languages, we'll check if the code structure is correct
        // and simulate based on expected patterns
        
        // Check if code has proper structure for the language
        let isValidStructure = false;
        
        if (language === 'python') {
          isValidStructure = code.includes('def ') && code.includes('return');
        } else if (language === 'java') {
          isValidStructure = code.includes('public') && code.includes('return');
        } else if (language === 'c') {
          isValidStructure = code.includes('return') && (code.includes('int ') || code.includes('void ') || code.includes('char '));
        }
        
        if (!isValidStructure) {
          results.push({ passed: false, input: tc.input, expected: tc.expected, actual: null, error: `Invalid ${language} code structure` });
          continue;
        }
        
        // For non-JS languages, we simulate by checking if code logic appears correct
        // This is a simplified evaluation - in production, use a proper code execution service
        
        // Try to evaluate as JavaScript as a fallback (for simple algorithms)
        try {
          let jsCode = code;
          
          if (language === 'python') {
            // Convert simple Python to JS
            jsCode = code
              .replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'function $1($2) {')
              .replace(/elif/g, '} else if')
              .replace(/else\s*:/g, '} else {')
              .replace(/if\s+(.+):/g, 'if ($1) {')
              .replace(/for\s+(\w+)\s+in\s+range\s*\(([^)]+)\)\s*:/g, 'for (let $1 = 0; $1 < $2; $1++) {')
              .replace(/\bTrue\b/g, 'true')
              .replace(/\bFalse\b/g, 'false')
              .replace(/\bNone\b/g, 'null')
              .replace(/\band\b/g, '&&')
              .replace(/\bor\b/g, '||')
              .replace(/\bnot\b/g, '!')
              + '\n}';
          } else if (language === 'java' || language === 'c') {
            // Extract function body for simple cases
            const funcMatch = jsCode.match(/(?:public\s+static\s+)?(?:int|String|boolean|void|char|long|double|float)\s+(\w+)\s*\([^)]*\)\s*\{([\s\S]*)\}/);
            if (funcMatch) {
              const fnName = funcMatch[1];
              const body = funcMatch[2];
              jsCode = `function ${fnName}(${Object.keys(tc.input).join(', ')}) {${body}}`;
            }
          }
          
          const funcMatch = jsCode.match(/function\s+(\w+)/);
          if (funcMatch) {
            const fnName = funcMatch[1];
            const evalCode = `
              ${jsCode}
              ${fnName}(${Object.values(tc.input).map(v => JSON.stringify(v)).join(', ')})
            `;
            actual = new Function(`return ${evalCode}`)();
          } else {
            // If conversion fails, mark as needs manual review
            results.push({ passed: false, input: tc.input, expected: tc.expected, actual: null, error: 'Code execution not supported for this language pattern' });
            continue;
          }
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown error';
          results.push({ passed: false, input: tc.input, expected: tc.expected, actual: null, error: `Evaluation error: ${errorMessage}` });
          continue;
        }
      }
      
      // Compare results
      const isPassed = JSON.stringify(actual) === JSON.stringify(tc.expected);
      if (isPassed) passed++;
      
      results.push({ passed: isPassed, input: tc.input, expected: tc.expected, actual });
    } catch (e: unknown) {
      console.error('Test case evaluation error:', e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      results.push({ passed: false, input: tc.input, expected: tc.expected, actual: null, error: errorMessage });
    }
  }
  
  return { passed, total: testCases.length, results };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, testCases, functionName }: EvaluationRequest = await req.json();
    
    console.log(`Received evaluation request for ${language}`);
    console.log(`Code length: ${code.length}, Test cases: ${testCases.length}`);
    
    if (!code || !language || !testCases) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: code, language, testCases' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const result = evaluateCode(code, language, testCases, functionName);
    
    console.log(`Evaluation complete: ${result.passed}/${result.total} passed`);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Evaluation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
