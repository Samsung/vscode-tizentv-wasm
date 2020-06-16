var forge = require('node-forge');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var common = require('./common');
var logger = require('./logger');

var extensionPath = common.extensionRootPath;
var certPath = common.extensionCertPath;
var authorPath = extensionPath + '/resource/Author'.split('/').join(path.sep);
var caPriKeyPath = certPath + path.sep + 'tizen-author.pri';
var caCertPath = certPath + path.sep + 'tizen-author.ca';

// Module name
var moduleName = 'Generate Certificate';

function createCert(authorCertName, authorCertPath, authorPassword, countryInfo, stateInfo, cityInfo, organizationInfo, DepartmentInfo, EmailInfo ){
    try {
        // generate a keypair
        logger.info(moduleName, 'Generating 1024-bit key-pair...');
        var keys = forge.pki.rsa.generateKeyPair(1024);
        logger.info(moduleName, 'Key-pair created.');

        // create a certificate
        logger.info(moduleName, 'Creating certificate...');
        var cert = forge.pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.serialNumber = '01';
        //cert.validity.notBefore = new Date();
        //cert.validity.notAfter = new Date();
        //cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        var notBeforeDate = new Date();
        notBeforeDate.setFullYear(2012,10,2);
        notBeforeDate.setHours(00,00,00,000);

        var notAfterDate = new Date();
        notAfterDate.setFullYear(2018,12,2);
        notAfterDate.setHours(00,00,00,000);

        cert.validity.notBefore = notBeforeDate;
        cert.validity.notAfter = notAfterDate;

        var attrs = [ {
            name: 'countryName',
            value: countryInfo
        }, {
            shortName: 'ST',
            value: stateInfo
        }, {
            name: 'localityName',
            value: cityInfo
        }, {
            name: 'organizationName',
            value: organizationInfo
        }, {
            shortName: 'OU',
            value: DepartmentInfo
        },{
            name: 'emailAddress',
            value: EmailInfo
        }];

        var issurInfo = [{
            name: 'organizationName',
            value: 'Tizen Association'
        }, {
            shortName: 'OU',
            value: 'Tizen Association'
        }, {
            shortName: 'CN',
            value: 'Tizen Developers CA'
        }];
        cert.setSubject(attrs);
        cert.setIssuer(issurInfo);
        
        cert.setExtensions([{
            name: 'basicConstraints',
            cA: true
        }, {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true
        }, {
            name: 'extKeyUsage',
            codeSigning: true
        }]);


        //read ca private Key
        logger.info(moduleName, 'Read ca private Key');
        //var caPriPem = fs.readFileSync(caPriKeyPath);
        let key = 'SRCNSDKTEAM2019';
        key = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);

        let inputData = fs.readFileSync(caPriKeyPath);
        const iv = Buffer.alloc(16, 0);
        let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        let caPriPem = Buffer.concat([decipher.update(inputData,'hex'), decipher.final()]);
        var caPassword = 'tizencertificatefordevelopercaroqkfwk';

        var decryptedCaPriKey = forge.pki.decryptRsaPrivateKey(caPriPem.toString('utf8'), caPassword);
    

        cert.sign(decryptedCaPriKey);
        logger.info(moduleName, 'Certificate created.');

        //var userPriKey = forge.pki.privateKeyToPem(keys.privateKey);
        var userCert =  forge.pki.certificateToPem(cert);
    
        var caCert = loadCaCert();
        var certArray = [userCert, caCert];


        // create PKCS12
        logger.info(moduleName, 'Creating PKCS#12...');
        var newPkcs12Asn1 = forge.pkcs12.toPkcs12Asn1(
            keys.privateKey, certArray, authorPassword,
            {generateLocalKeyId: true, friendlyName: authorCertName});

        var newPkcs12Der = forge.asn1.toDer(newPkcs12Asn1).getBytes();

        fs.writeFileSync(authorCertPath, newPkcs12Der, {encoding: 'binary'});

        logger.info(moduleName, authorCertPath + ' created.');

        
    } catch(ex) {
        if(ex.stack) {
            console.log(ex.stack);
        } else {
            console.log('Error', ex);
        }
    }
}
exports.createCert = createCert;
 
function loadCaCert() {
    
    let key = 'SRCNSDKTEAM2019';
    key = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);

    let inputData = fs.readFileSync(caCertPath);
    const iv = Buffer.alloc(16, 0);
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    //var caCert = fs.readFileSync(caCertPath);
    let caCert = Buffer.concat([decipher.update(inputData,'hex'), decipher.final()]);
    //console.log(caCert.toString('utf8'));
    var caContent = caCert.toString('utf8');

    var strBeginCertificate = '-----BEGIN CERTIFICATE-----';
    var strEndCertificate = '-----END CERTIFICATE-----';
    
    var line1Beg  = caContent.indexOf(strBeginCertificate);
    var line1End  = caContent.indexOf(strEndCertificate);

    var strBeginLen = strBeginCertificate.length;
    var strEndLen = strEndCertificate.length;
    
    var cert1 = caContent.substring(line1Beg, line1End+strEndLen);
    //console.log(cert1);
    return cert1;
}

exports.loadCaCert = loadCaCert;