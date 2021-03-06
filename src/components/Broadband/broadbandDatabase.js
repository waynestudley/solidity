import Dexie from 'dexie';

const db = new Dexie('broadbandDb');

db.version(1).stores({
    userAgent: '',
    customer: '',
    package: '',
    customerServices: '',
    usage: '',
    devices: ''
});

//packageName: '',
//currentPay: '',
//application: ''

// db.version(3).stores({
//     userAgent: 'SalesAgentId, CallcentreId, Name',
//     customer: '++id, Title, Firstname, Lastname, Address, Address1, Address2, Address3, Postcode, TelephoneNumber, EmailAddress, energyAppId, Town, County, resultKey',
//     package: '++id, SelectedPackageId, PerfectPackage, SuperCard, packageName',
//     packageName: '++id, packageName',
//     customerServices: '++id, provider, years, months, total',
//     usage: '++id, broadbandCheck, phoneCheck, smartCheck, entertainmentCheck, sportsCheck, moviesCheck, netflixCheck, primeCheck, nowCheck',
//     currentPay: '++id, currentMonthlyPayment',
//     devices: '++id, numDevicesHighUse, numDevicesMediumUse, numDevicesLowUse',
//     application: '++id, resultKey, firstName, lastName, telephone'
// });

// db.version(2).stores({
//     userAgent: '++id, SalesAgentId, CallcentreId, Name',
//     customer: '++id, Title, Firstname, Lastname, Address, Address1, Address2, Address3, Postcode, TelephoneNumber, EmailAddress, energyAppId, Town, County, resultKey',
//     package: '++id, SelectedPackageId, PerfectPackage, SuperCard, packageName',
//     customerServices: '++id, provider, years, months, total',
//     usage: '++id, broadbandCheck, phoneCheck, smartCheck, entertainmentCheck, sportsCheck, moviesCheck, netflixCheck, primeCheck, nowCheck',
//     currentPay: '++id, currentMonthlyPayment',
//     devices: 'numDevicesHighUse, numDevicesMediumUse, numDevicesLowUse'
// });

// db.version(1).stores({
//     userAgent: '++id, SalesAgentId, CallcentreId, Name',
//     customer: '++id, Title, Firstname, Lastname, Address, Address1, Address2, Address3, Postcode, TelephoneNumber, EmailAddress, energyAppId, Town, County, resultKey',
//     package: '++id, SelectedPackageId, PerfectPackage, SuperCard, packageName',
//     customerServices: '++id, provider, years, months, total, broadbandCheck, phoneCheck, smartCheck, moviesCheck, sportsCheck, entertainmentCheck, netflixCheck, primeCheck, nowCheck, numDevicesHighUse, numDevicesMediumUse, numDevicesLowUse, currentMonthlyPayment'
// });

export default db;