import { replaceText, getVariants, sendDataToBackend } from '../lib/coframe';

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

describe('getVariants', () => {
        test('it should fetch variant data from the API', async () => {
            // Setup
            const mockApiResponse = { "variants": [], "session_ids": [] }; // Match your actual expected response structure
            const mockJsonPromise = Promise.resolve(mockApiResponse);
            const mockFetchPromise = Promise.resolve({
                json: () => mockJsonPromise,
            });
            jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

            // Run
            const response = await getVariants('testPageId');

            // Assert
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            expect(response).toEqual(mockApiResponse); // Check that the function returns the correct data

            // Cleanup
            global.fetch.mockClear();
        });
    });

    describe('sendDataToBackend', () => {
        test('it should send data to the API', async () => {
        // Setup
            const mockApiResponse = { "message": "Sessions updated successfully" }; // Match your actual expected response structure
            const mockJsonPromise = Promise.resolve(mockApiResponse);
            const mockFetchPromise = Promise.resolve({
                json: () => mockJsonPromise,
            });
            jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

            // Run
            const response = await sendDataToBackend({});

            // Assert
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: expect.any(String),
            });
            expect(response).toEqual(mockApiResponse); // Check that the function returns the correct data

            // Cleanup
            global.fetch.mockClear();
        });
    });
});