import Dexie from 'dexie';

const db = new Dexie('broadbandDb');
db.version(1).stores({
    userAgent: '++id, SalesAgentId, CallcentreId, Name',
    customer: '++id, Title, Firstname, Lastname, Address, Address1, Address2, Address3, Postcode, TelephoneNumber, EmailAddress, energyAppId, Town, County, resultKey',
    package: '++id, SelectedPackageId, PerfectPackage, SuperCard, packageName',
    customerServices: '++id, provider, years, months, total, hasAerial, canHaveVirgin, broadbandCheck, phoneCheck, smartCheck, moviesCheck, sportsCheck, entertainmentCheck, netflixCheck, primeCheck, nowCheck, numDevicesHighUse, numDevicesMediumUse, numDevicesLowUse, currentMonthlyPayment'
});

export default db;