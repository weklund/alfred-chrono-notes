describe("Current Day Action", () => {

    const VALID_OBSIDIAN_VAULT_NAME = "Personal";
    const VALID_DAILY_PATH = "/Users/ekluw/Projects/obsidian/Personal/999-Planner/DailyPlans";
    const VALID_TEMPLATE_PATH = "~/Projects/obsidian/Personal/999-Templates/daily plan template.md";

    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); // Most important - it clears the cache
        process.env = { ...OLD_ENV }; // Make a copy
    });

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });

    it("should be able to get current day file path with valid env vars", () => {
        process.env.OBSIDIAN_VAULT_NAME = VALID_OBSIDIAN_VAULT_NAME;
        process.env.DAILY_PATH = VALID_DAILY_PATH;
        process.env.DAILY_TEMPLATE_PATH = VALID_TEMPLATE_PATH;


    })


    it("should be able to create a templated daily note when it doesn't exist yet", () => {


    })

    it("should be able to construct a valid obsidian URI", () => {


    })

    it("should open Obsidian with a URI", () => {


    })
})