import * as db from 'universal-db-driver';
import * as cache from 'cache';

let daf = db.DBPersistance();
let cachePersistance = cache.getCache();

export async function loadFeaturesData() {
    console.log('Get permission parameters from MongoDB');
    let features = await daf.findAll({}, '', 'features', 'MasterData');
    for (let i = 0; i < features.length; i++) {
        addToCache(features[i]);
    }
}

function addToCache(feature) {
    console.log('Adding data to Redis cache');
    for (let i = 0; i < feature.roles.length; i++) {
        cachePersistance.addToCache('access', feature.url + '_' + feature.roles[i]);
    }
}
