import { getPollingLocations } from "./locations";
import db from "../db/db";
import fetch from "node-fetch";

async function generateResponse(message: string, from: string): Promise<string> {
    message = message.toLowerCase().trim().replace(/\.|\?|\!|\'|\"/g, '');
    const language = await db.getLanguage(from);

    const zipMatches: string[] | null = message.match(/\d{5}/);

    if (zipMatches && zipMatches.length == 1) {
        const zipCode = zipMatches[0];
        const locations: any[] | null = await getPollingLocations(zipCode, 3);

        if (locations) {
            const locationsStrings = locations.map((location) => `${location.name}, ${location.room}\n${location.address}, ${location.city}, TX`)

            setTimeout(() => sendFollowUp(from, language), 5000);

            if (language === "en" || !language) {
                return `If you're registered to vote in Dallas County, you can go to any Dallas County voting locations. I found these nearby:\n\n${locationsStrings.join("\n\n")}`;
            } else {
                return `Si usted está registrado para votar en el condado de Dallas, puede votar en cualquiera de los locales de votación. Aquí están los tres más cercanos:\n\n${locationsStrings.join("\n\n")}`;
            }

        } else {
            if (language === "en" || !language) {
                return `I'm sorry. I could not find that ZIP code. Please check that you've entered it correctly and try again.`
            } else {
                return `Lo siento, no pude encontrar ese código postal. Favor de revisar el numero e intentar de nuevo.`
            }
        }

    } else if (message === "vote") {
        db.setLanguage(from, "en");
        return "Hi, I'm your Dallas County voting assistant. I can provide you with your three nearest voting locations. To begin, please respond with your ZIP code.";
    } else if (message === "votar" || message === "vota") {
        db.setLanguage(from, "es");
        return "Hola, yo soy su asistente para votar en el condado de Dallas y puedo darle los tres locales más cercanos a usted. Favor de responder con su código postal (ZIP code)."
    }

    if (language === "en" || !language) {
        return "I'm sorry. I didn't understand that. Please respond with your ZIP code to see your three nearest voting locations or type VOTAR to change to español."
    } else {
        return "Lo siento, no entendí su respuesta. Por favor entre un código postal para ver los tres locales de votación más cercanos o entre VOTE si quiere cambiar a English."
    }
}

function sendFollowUp(number: string, language: string) {
    if (process.env.NODE_ENV != "production") {
        console.log("Follow up!");
        return;
    }

    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    let message = "";

    if (language === "en" || !language) {
        message = "Thanks for taking the time to vote!\n\nTo expedite your visit, don’t forget to check out your ballot and candidates at vote411.org. Remember you can’t use your phone in the voting booth, so make note of your choices on good old pencil and paper.\n\nAlso, make sure you have a valid ID. You can check out the list of valid IDs at https://www.votetexas.gov/register-to-vote/need-id.html"
    } else {
        message = "Gracias por tomar el tiempo de ir a votar!\n\nPara que el proceso le sea de lo más fácil, puede encontrar un ejemplo de su papeleta e información sobre los candidatos en vote411.org. Recuerde que no puede usar su teléfono dentro del centro de votación, así que haga uso de papel y lápiz para referencia a lo que vote.\n\nNo se olvide su identificación! Puede encontrar la lista de identificaciones válidas aquí: https://www.votetexas.gov/es/registrese-para-votar/necesita-identificacion.html"
    }

    client.messages.create({
        body: message,
        from: process.env.TWILIO_NUMBER,
        to: number
    });
}

export { generateResponse };