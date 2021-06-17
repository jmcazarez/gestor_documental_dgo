/*
 * Copyright (c) 2015, SeguriData <www.seguridata.com>
 * Author adiaz <adiaz@seguridata.com>,
 * Todos los derechos y beneficios provenientes del uso de las marcas, logotipos y
 * nombres comerciales de SeguriData son y pertenecen únicamente a SeguriData y
 * están protegidos por las leyes y tratados sobre derechos de autor y propiedad
 * intelectual aplicables.  Asimismo, la titularidad y derechos de autor con
 * respecto al componente “Javascript” es propiedad de SeguriData incluyendo, pero
 * sin limitarse a código fuente, código objeto, imágenes, fotografías, animaciones,
 * vídeo, audio, música, texto, rutinas y "applets" o subprogramas incorporados, así
 * como manuales y los materiales que en su caso lo acompañen. Usted se obliga a no
 * alterar, ni remover cualquier referencia de marca, logotipos y/o nombres
 * comerciales de SeguriData insertados, asentados o de cualquier otra forma
 * contenidos en cualquiera de sus productos o componentes. En caso de violación a
 * esta disposición, se hará acreedor a las penas impuestas por la legislación sobre
 * Propiedad Industrial  y el Código Penal Federal.
*/
 
   var SD_SHA1_NAME   = "SHA-1";
   var SD_SHA256_NAME = "SHA-256";
   var SD_SHA384_NAME = "SHA-384";
   var SD_SHA512_NAME = "SHA-512";
   
   var CMS_SIGNED_DATA = "1.2.840.113549.1.7.2";
   var DATA_CONTENT_TYPE = "1.2.840.113549.1.7.1";
   var SD_RSAENCRYPTION = "1.2.840.113549.1.1.1";
   
   var SD_SHA1_DOID   = "1.3.14.3.2.26";
   var SD_SHA256_DOID = "2.16.840.1.101.3.4.2.1";
   var SD_SHA384_DOID = "2.16.840.1.101.3.4.2.2";
   var SD_SHA512_DOID = "2.16.840.1.101.3.4.2.3";
   
   var SD_UNKNOWN_ALGORITHM = "An unknown hash Algorithm was supplied";
   var SD_ERROR_ENCODING_PKCS7 = "Error during encoding of PKCS#7 Signed Data: ";
   var SD_ERROR_EMPTY_SIGNATURE = "An empty or invalid value was received for signature";
   var SD_ERROR_EMPTY_CERTIFICATE = "An empty or invalid value was received for certificate";
   
   function empty(data) {
        if(typeof(data) == 'undefined' || data === null) {
			return true;
	    }
   }
   
   // function to convert string to ArrayBuffer
   function str2ab(str) {
      var buf = new ArrayBuffer(str.length);
	  var bufView = new Uint8Array(buf);
	  
	  for(var i = 0, strLen = str.length; i < strLen; i++)
	     bufView[i] = str.charCodeAt(i);
	  return buf;
	};	
	
	function arrayBufferToString(buffer,onSuccess,onFail) {
		var bufView = new Uint8Array(buffer);
		var length = bufView.length;
		var result = '';

		for(var i = 0;i<length;i+=65535) {
			var addition = 65535;
			if(i + 65535 > length) {
				addition = length - i;
			}
			result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
		}

		if(result) {
			if(onSuccess)
				onSuccess(result);
		} else {
			if(onFail)
				onFail('buffer was invalid');
	    }
		return result;
	}	
	
	function SDSgLib_encodePKCS7Detached(certBuffer, signatureBuffer, hashAlgorithm) {
		var content2Sign = null;
		return SDSgLib_encodePKCS7(certBuffer, signatureBuffer, hashAlgorithm, content2Sign);
	}
	
	function SDSgLib_encodePKCS7WithContent(certBuffer, signatureBuffer, hashAlgorithm, content2Sign) {
		return SDSgLib_encodePKCS7(certBuffer, signatureBuffer, hashAlgorithm, content2Sign);
	}	  
	  
	function SDSgLib_encodePKCS7(certBuffer, signatureBuffer, hashAlgorithm, content2Sign) {
		var hashAlgDOid = ""
		if(hashAlgorithm == SD_SHA1_NAME)
		   hashAlgDOid = SD_SHA1_DOID;
		else
		if(hashAlgorithm == SD_SHA256_NAME)
		   hashAlgDOid = SD_SHA256_DOID;
		else	 
		if(hashAlgorithm == SD_SHA384_NAME)
		   hashAlgDOid = SD_SHA384_DOID;
		else
		if(hashAlgorithm == SD_SHA512_NAME)
		   hashAlgDOid = SD_SHA512_DOID;
		else {
		   return new Promise(function(resolve, reject) { reject(SD_UNKNOWN_ALGORITHM); });
		}
				
		if(!(signatureBuffer instanceof ArrayBuffer) || signatureBuffer == null || signatureBuffer.length == 0)
			return new Promise(function(resolve, reject) { reject(SD_ERROR_EMPTY_SIGNATURE); });
		
		if(!(typeof(certBuffer) == "string") || certBuffer == null || certBuffer.length == 0) 
			return new Promise(function(resolve, reject) { reject(SD_ERROR_EMPTY_CERTIFICATE); });		
		
		return new Promise(function(resolve, reject) {		

		// calls to convert b64 PEM cert to an array in the variable 'cert_simpl'
		var asn1 = org.pkijs.fromBER(str2ab(certBuffer));
		var cert_simpl = new org.pkijs.simpl.CERT({ schema: asn1.result });
		var sequence = Promise.resolve();
							
        sequence = sequence.then(
		    function() {
				var encapContentInfo = new org.pkijs.simpl.cms.EncapsulatedContentInfo({
				eContentType: DATA_CONTENT_TYPE});
							
				if(content2Sign != null) {
					encapContentInfo.eContent = new org.pkijs.asn1.OCTETSTRING({ value_hex: content2Sign });
				}
							
				return new org.pkijs.simpl.CMS_SIGNED_DATA({
                        version: 1,
						digestAlgorithms: [new org.pkijs.simpl.ALGORITHM_IDENTIFIER({
						algorithm_id: hashAlgDOid,
						algorithm_params: new org.pkijs.asn1.NULL()
						})],
                        encapContentInfo: encapContentInfo,
                        signerInfos: [
                            new org.pkijs.simpl.CMS_SIGNER_INFO({
                                version: 1,
                                sid: new org.pkijs.simpl.cms.IssuerAndSerialNumber({
                                    issuer: cert_simpl.issuer,
                                    serialNumber: cert_simpl.serialNumber
                                }), 
								digestAlgorithm : new org.pkijs.simpl.ALGORITHM_IDENTIFIER({
								algorithm_id: hashAlgDOid,
								algorithm_params: new org.pkijs.asn1.NULL()
								}),
								signatureAlgorithm : new org.pkijs.simpl.ALGORITHM_IDENTIFIER({
								algorithm_id: SD_RSAENCRYPTION
								}),								
								signature : new org.pkijs.asn1.OCTETSTRING({ value_hex: signatureBuffer })
                            })
                        ],
                        certificates: [cert_simpl]
                });
					
			}
		);
		
		sequence.then(
                function(result)
                {
                    var cms_signed_schema = result.toSchema(true);
					
                    var cms_content_simp = new org.pkijs.simpl.CMS_CONTENT_INFO({
                        contentType: CMS_SIGNED_DATA,
                        content: cms_signed_schema
                    });
					
                    var cms_signed_schema = cms_content_simp.toSchema(true);
                    var cms_signed_encoded = cms_signed_schema.toBER(false);              
					resolve(cms_signed_encoded);
                },
                function(error)
                {
                    alert(SD_ERROR_ENCODING_PKCS7 + error);
                }
        );					

	   });
	  }		  