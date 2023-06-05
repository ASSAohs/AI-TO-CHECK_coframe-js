import { getVariants, sendDataToBackend } from '../lib/coframe';
import { replaceText } from '../lib/utils'
import fetch from 'cross-fetch';

global.fetch = fetch;

describe('coframe module', () => {
    describe('replaceText', () => {
        // Note: testing replaceText in isolation would require a DOM environment (e.g. jsdom)
        test('it should replace all instances of the original text', () => {
            // Setup
            document.body.innerHTML = `
                <div>
                    <p id="testCopy">Hello, world!</p>
                    <p id="testCopy2">Hello, world!</p>
                    <p id="controlCopy">Don't change this one!</p>
                </div>
            `;
    
            const original = 'Hello, world!';
            const replacement = 'Goodbye, world!';
            const control = "Don't change this one!";
    
            // Run
            replaceText(original, replacement);
    
            // Assert
            const testCopy = document.getElementById('testCopy');
            const testCopy2 = document.getElementById('testCopy2');
            const controlCopy = document.getElementById('controlCopy');
            expect(testCopy.textContent).toEqual(replacement);
            expect(testCopy2.textContent).toEqual(replacement);
            expect(controlCopy.textContent).toEqual(control);
        });
    });
});