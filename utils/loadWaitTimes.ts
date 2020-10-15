import fetch from "node-fetch";
import db from "../src/services/db";

const waitTimeUrl = "https://services6.arcgis.com/hOUm949jlVALzDYU/arcgis/rest/services/EV_sites_20200819/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=USER_ADDRE%2CUSER_ROOM%2CUSER_CITY%2CUSER_ZIP%2CWAIT_TIME%2CUSER_NAME%2COBJECTID&orderByFields=WAIT_TIME%20DESC";

(async () => {
    try {
        let result = await fetch(waitTimeUrl);
        let resultJson = await result.json();

        let locations = resultJson.features.map((feature: { [f: string]: { [a: string]: string } }) => ({
            referenceId: feature.attributes.OBJECTID,
            waitMinutes: feature.attributes.WAIT_TIME
        }));

        await db.connect();
        locations.forEach((location: { [a: string]: string }) => {
            db.run("UPDATE locations SET waitMinutes = ? WHERE referenceId = ?;", [location.waitMinutes, location.referenceId]);
        });
        console.log("loaded wait times successfully");
    } catch (e) {
        console.error(e);
    }
})();