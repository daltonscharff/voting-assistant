import Location from "../interfaces/Location";

const responses: { [messageType: string]: { [language: string]: string } } = {
    greeting: {
        en: "Hi, I'm your Dallas County voting assistant. I can provide you with your three nearest voting locations. To begin, please respond with your ZIP code.",
        es: "Hola, soy su asistente para votar en el condado de Dallas. Favor de responder con su código postal, para darle sus tres locales más cercanos."
    },
    locationsFound: {
        en: "If you're registered to vote in Dallas County, you can go to any Dallas County voting location. I found these nearby:",
        es: "Si usted está registrado para votar en el condado de Dallas, puede votar en cualquiera de los locales de votación. Aquí están los tres más cercanos:"
    },
    noLocationsFound: {
        en: "I'm sorry. I could not find that ZIP code. Please check that you've entered it correctly and try again.",
        es: "Lo siento, no pude encontrar ese código postal. Favor de revisar el numero e intentar de nuevo."
    },
    fallback: {
        en: "I'm sorry. I didn't understand that. Please respond with your ZIP code to see your three nearest voting locations or type VOTAR to change to español.",
        es: "Lo siento, no entendí su respuesta. Por favor entre un código postal para ver los tres locales de votación más cercanos o entre VOTE si quiere cambiar a English."
    },
    followUp: {
        en: "To expedite your visit, check out your ballot and candidates at vote411.org.\nRemember, you can’t use your phone in the voting booth, so take note of your choices on paper.\nAlso, make sure you have a valid ID: https://www.votetexas.gov/register-to-vote/need-id.html",
        es: "Para que el proceso le sea de lo más fácil, puede encontrar un ejemplo de su papeleta e información sobre los candidatos en vote411.org.\nRecuerde que no puede usar su teléfono dentro del centro de votación.\nNo se olvide su identificación! https://www.votetexas.gov/es/registrese-para-votar/necesita-identificacion.html"
    }
}

function nearestLocationResponseBuilder(text: string, locations: Location[], language: string): string {
    let response: string = `${text}`;

    for (let location of locations) {
        let locationString = location.name;
        if (location.room) locationString += `, ${location.room}`;
        locationString += `\n${location.address}, ${location.city}, ${location.state}`;
        if (location.waitMinutes) {
            if (language == "en") {
                locationString += `\nWait time: ${location.waitMinutes} minutes`;
            } else {
                locationString += `\nTiempo de espera: ${location.waitMinutes} minutos`;
            }
        }
        response += `\n\n${locationString}`;
    }
    return response;
}

function sendTextMessage(text: string, number: string) {
    console.log(`Message: ${text}\nTo: ${number}`);

    if (process.env.NODE_ENV != "production") return;

    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    twilio.messages.create({
        body: text,
        from: process.env.TWILIO_NUMBER,
        to: number
    });
}

export { responses, nearestLocationResponseBuilder, sendTextMessage };