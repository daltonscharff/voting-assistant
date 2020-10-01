import { getPollingLocations } from "./findPollingLocations.controller";

async function generateResponse(message: string): Promise<string> {
    message = message.toLowerCase();

    const zipMatches: string[] | null = message.match(/\d{5}/);

    if (zipMatches && zipMatches.length == 1) {
        const zipCode = zipMatches[0];
        const locations: any[] = await getPollingLocations(zipCode, 3);
        const locationsStrings = locations.map((location) => `${location.name}, ${location.room}\n${location.address}`)
        return `I found the following voting locations nearby:\n${locationsStrings.join("\n\n")}`;
    } else if (message === "vote" || message === "help") {
        return "Hi, I'm your Dallas County voting assistant. I can provide you with your 3 nearest polling locations. To begin, please respond with your ZIP code.";
    }
    return "I'm sorry. I didn't understand that. Type 'help' to see what I can do."
}

export { generateResponse };