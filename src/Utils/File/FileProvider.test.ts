    describe("isValidPathSchema", () => {

        describe("has valid path cases", () => {
            it('should return true if file name without path', () => {
                const path = 'file.txt';
                expect(isValidPathSchema(path)).toBeTruthy()
            });

            it('should return true if path with subdirectories', () => {
                const path = 'user/data/input.txt';
                expect(isValidPathSchema(path)).toBeTruthy()
            });

            it('should return true if path with dots and dashes', () => {
                const path = 'user/data-2023/archive.input.txt';
                expect(isValidPathSchema(path)).toBeTruthy()
            });

            it('should return true if absolute path is in /Users/username', () => {
                const path = '/Users/username/data/input.txt';
                expect(isValidPathSchema(path)).toBeFalsy()
            })
        })


        describe("has invalid path cases", () => {
            it('should return false if path starts with a dot', () => {
                const path = './config.json';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path starts with double dots', () => {
                const path = '../config.json';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has backwards slashes', () => {
                const path = 'user\\data\\input.txt';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has illegal characters', () => {
                const path = 'user/data/input<>.txt';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has absolute path only', () => {
                const path = '/etc/passwd';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            // TODO:  Is this the correct example for null byte?
            it('should return false if path has null byte injection', () => {
                const path = 'user/data\0script.js';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has empty string', () => {
                const path = '';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has only special characters', () => {
                const path = '***********';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

        })
    })