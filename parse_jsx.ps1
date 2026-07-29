$source = Get-Content index.html -Raw

Add-Type @"
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

public class JsxParser {
    public static string CheckBalance(string source) {
        // extract the babel block
        var match = Regex.Match(source, @"<script type=""text/babel"">([\s\S]*?)</script>");
        if (!match.Success) return "Babel block not found.";
        
        string code = match.Groups[1].Value;
        
        // Remove multi-line comments {/* ... */} and /* ... */
        code = Regex.Replace(code, @"/\*[\s\S]*?\*/", "");
        
        // Remove single-line comments // ...
        code = Regex.Replace(code, @"//.*", "");
        
        // Match tags <tag>, </tag>, <tag />
        // Simplification: assume tags don't contain < or > in attributes, except inside strings or { }
        // Actually, matching all <...> is tricky.
        var tags = Regex.Matches(code, @"<\/?([A-Za-z0-9]+)[^>]*>");
        
        Stack<string> stack = new Stack<string>();
        
        foreach (Match m in tags) {
            string tagStr = m.Value;
            string tagName = m.Groups[1].Value;
            
            // ignore self-closing
            if (tagStr.EndsWith("/>")) continue;
            
            // ignore certain self closing HTML tags if they don't have closing tags? 
            // In JSX, ALL tags must be closed explicitly or be self-closing.
            // If someone wrote <input class="..."> without /> it breaks Babel!
            if (tagName == "input" || tagName == "img" || tagName == "br" || tagName == "hr" || tagName == "col") {
                if (!tagStr.EndsWith("/>")) {
                    return "ERROR: Unclosed void tag: " + tagStr;
                }
                continue;
            }
            
            if (tagStr.StartsWith("</")) {
                if (stack.Count > 0 && stack.Peek() == tagName) {
                    stack.Pop();
                } else {
                    return "ERROR: Mismatched closing tag: " + tagStr + ". Expected: " + (stack.Count > 0 ? stack.Peek() : "EMPTY");
                }
            } else {
                stack.Push(tagName);
            }
        }
        
        if (stack.Count > 0) {
            return "ERROR: Unclosed tags remaining. Top of stack: " + stack.Peek();
        }
        
        return "SUCCESS: All tags balanced.";
    }
}
"@

[JsxParser]::CheckBalance($source)
