var forge = require('node-forge');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var common = require('./common');
var logger = require('./logger');

var extensionPath = common.extensionRootPath;
var certPath = common.extensionCertPath;
var authorPath = extensionPath + '/resource/Author'.split('/').join(path.sep);
var caSignerPath = certPath + path.sep + 'developer' + path.sep + common.getDeveloperSignerName();
var caCertPath = certPath + path.sep + 'developer' + path.sep + common.getDeveloperCaName();

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
        var caSigner = fs.readFileSync(caSignerPath);
        var caPKCS = common.getDeveloperSignerPKCS();

        var decryptedCaPriKey = forge.pki.decryptRsaPrivateKey(caSigner.toString('utf8'), caPKCS);
    

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
    var caCert = fs.readFileSync(caCertPath);
    var caContent = caCert.toString('utf8');

    var strBeginCertificate = '-----BEGIN CERTIFICATE-----';
    var strEndCertificate = '-----END CERTIFICATE-----';
    
    var line1Beg  = caContent.indexOf(strBeginCertificate);
    var line1End  = caContent.indexOf(strEndCertificate);

    var strBeginLen = strBeginCertificate.length;
    var strEndLen = strEndCertificate.length;
    
    var cert1 = caContent.substring(line1Beg, line1End+strEndLen);
    return cert1;
}

exports.loadCaCert = loadCaCert;