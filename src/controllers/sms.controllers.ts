import { getPollingLocations } from "./findPollingLocations.controller";

async function generateResponse(message: string): Promise<string> {
    message = message.toLowerCase().trim().replace(/\.|\?|\!|\'|\"/g, '');

    const zipMatches: string[] | null = message.match(/\d{5}/);

    if (zipMatches && zipMatches.length == 1) {
        const zipCode = zipMatches[0];
        const locations: any[] | null = await getPollingLocations(zipCode, 3);

        if (locations) {
            const locationsStrings = locations.map((location) => `${location.name}, ${location.room}\n${location.address}, ${location.city}, TX`)
            return `I found the following voting locations nearby:\n\n${locationsStrings.join("\n\n")}`;
        } else {
            return `I'm sorry. I could not find that ZIP code. Please check that you've entered it correctly and try again.`
        }

    } else if (message === "vote") {
        return "Hi, I'm your Dallas County voting assistant. I can provide you with your three nearest polling locations. To begin, please respond with your ZIP code.";
    }
    return "I'm sorry. I didn't understand that. Please respond with your ZIP code to see your three nearest polling locations."
    // return "I'm sorry. I didn't understand that. Please respond with your ZIP code to see your three nearest polling locations or type 'votar' to change to Spanish."
}

export { generateResponse };