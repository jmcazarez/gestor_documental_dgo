/*
 * Copyright (c) 2015, SeguriData
 * Author 2015, adiaz <www.seguridata.com>.
 * Todos los derechos y beneficios provenientes del uso de las marcas, logotipos y
 * nombres comerciales de SeguriData son y pertenecen únicamente a SeguriData y
 * estan protegidos por las leyes y tratados sobre derechos de autor y propiedad
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
(
function(in_window)
{
    //**************************************************************************************
    // #region Declaration of global variables 
    //**************************************************************************************
    // #region "org" namespace 
    if(typeof in_window.org === "undefined")
        in_window.org = {};
    else
    {
        if(typeof in_window.org !== "object")
            throw new Error("Name org already exists and it's not an object");
    }
    // #endregion 

    // #region "org.pkijs" namespace 
    if(typeof in_window.org.pkijs === "undefined")
        in_window.org.pkijs = {};
    else
    {
        if(typeof in_window.org.pkijs !== "object")
            throw new Error("Name org.pkijs already exists and it's not an object" + " but " + (typeof in_window.org.pkijs));
    }
    // #endregion 

    // #region "org.pkijs.schema" namespace 
    if(typeof in_window.org.pkijs.schema === "undefined")
        in_window.org.pkijs.schema = {};
    else
    {
        if(typeof in_window.org.pkijs.schema !== "object")
            throw new Error("Name org.pkijs.schema already exists and it's not an object" + " but " + (typeof in_window.org.pkijs.schema));
    }
    // #endregion 

    // #region "org.pkijs.schema.pkcs8" namespace 
    if(typeof in_window.org.pkijs.schema.pkcs8 === "undefined")
        in_window.org.pkijs.schema.pkcs8 = {};
    else
    {
        if(typeof in_window.org.pkijs.schema.pkcs8 !== "object")
            throw new Error("Name org.pkijs.schema.pkcs8 already exists and it's not an object" + " but " + (typeof in_window.org.pkijs.schema.pkcs8));
    }
    // #endregion   

    // #region "local" namespace 
    var local = {};
    // #endregion   
    //**************************************************************************************
    // #endregion 
    //**************************************************************************************
    // #region ASN.1 schema definition for "EncryptedPrivateKeyInfo" type (RFC5208) 
    //**************************************************************************************
    in_window.org.pkijs.schema.pkcs8.ENCRYPTED_PRIVATEKEY_INFO_WP52 =
    function()
    {
    //EncryptedPrivateKeyInfo ::= SEQUENCE {
    //  encryptionAlgorithm  EncryptionAlgorithmIdentifier,
    //  encryptedData        EncryptedData }
	
	var names = in_window.org.pkijs.getNames(arguments[0]);
	
	return (new in_window.org.pkijs.asn1.SEQUENCE({
		name: (names.block_name || "encryptedPrivateKeyInfo"),
		value: [
		in_window.org.pkijs.schema.pkcs8.ENCRYPTIONALGORITHM(names.algorithm || {
			names: {
				block_name: (names.encryptionAlgorithm || "encryptionAlgorithm")
				}
        }),
		new in_window.org.pkijs.asn1.OCTETSTRING({ name: (names.encryptedData || "encryptedData") })
		]
        }));
    }		
    //**************************************************************************************
    // #endregion 


   //**************************************************************************************
    // #region ASN.1 schema for PKCS8 "ENCRYPTIONALGORITHM" 
    //**************************************************************************************
    in_window.org.pkijs.schema.pkcs8.ENCRYPTIONALGORITHM =
    function()
    {
	    //  algorithm    OBJECT IDENTIFIER { id-PBES2 }
		//  parameters   PBES2-params DEFINED BY id-PBES2  ::= SEQUENCE {
		//	 keyDerivationFunc   AlgorithmIdentifier ::=  SEQUENCE {
		//		  algorithm   OBJECT IDENTIFIER { id-PBKDF2 }
		//		  parameters  PBKDF2-params ::= SEQUENCE {
		//			 salt            CHOICE {
		//								specified OCTET STRING { ... }
		//								otherSource AlgorithmIdentifier {{PBKDF2-SaltSources}}
		//							 }
		//			 iterationCount  INTEGER { 1..MAX }
		//			 keyLength       INTEGER { 1..MAX } OPTIONAL
		//			 prf             AlgorithmIdentifier {{ PBKDF2-PRFS }} DEFAULT id-hmacWithSHA1
		//		  }
		//	 }

		//	 encryptionScheme    AlgorithmIdentifier ::= SEQUENCE {
		//		symAlg   OBJECT IDENTIFIER { ... }
		//		iv       OCTET STRING      { ... }
		//	 }
		 // }

        var names = in_window.org.pkijs.getNames(arguments[0]);

        return (new in_window.org.pkijs.asn1.SEQUENCE({
            name: (names.block_name || ""),
            value: [
			    new in_window.org.pkijs.asn1.OID({ name: (names.encryptionAlgorithm || "algorithm") }),
                in_window.org.pkijs.schema.pkcs8.PARAMETERS(names.encryptionAlgorithm || {
                    names: {
                        block_name: (names.parameters || "")
                    }
                })
            ]
        }));
    }
    //**************************************************************************************
    // #endregion 		
	


   //**************************************************************************************
    // #region ASN.1 schema for PKCS8 "PARAMETERS" type 
    //**************************************************************************************
    in_window.org.pkijs.schema.pkcs8.PARAMETERS =
    function()
    {
		//		  parameters  PBKDF2-params ::= SEQUENCE {
		//			 salt            CHOICE {
		//								specified OCTET STRING { ... }
		//								otherSource AlgorithmIdentifier {{PBKDF2-SaltSources}}
		//							 }
		//			 iterationCount  INTEGER { 1..MAX }
		//			 keyLength       INTEGER { 1..MAX } OPTIONAL
		//			 prf             AlgorithmIdentifier {{ PBKDF2-PRFS }} DEFAULT id-hmacWithSHA1
		//		  }
		//	 }

		//	 encryptionScheme    AlgorithmIdentifier ::= SEQUENCE {
		//		symAlg   OBJECT IDENTIFIER { ... }
		//		iv       OCTET STRING      { ... }
		//	 }

        var names = in_window.org.pkijs.getNames(arguments[0]);

        return (new in_window.org.pkijs.asn1.SEQUENCE({
            name: (names.block_name || ""),
            value: [
                in_window.org.pkijs.schema.pkcs8.ENCALG_WithPBKDF2_params(names.parameters || {
                    names: {
                        block_name: (names.EncAlgWPBKDF2params || "")
                    }
                }),
                    in_window.org.pkijs.schema.ALGORITHM_IDENTIFIER(names.parameters || {
                        names: {
                            block_name: "encryptionScheme"
                        }
                    })				
            ]
        }));
    }
    //**************************************************************************************
    // #endregion 
	
	
    //**************************************************************************************
    // #region ASN.1 schema for PKCS8 "ENCALG_WithPBKDF2_params" type 
    //**************************************************************************************
    in_window.org.pkijs.schema.pkcs8.ENCALG_WithPBKDF2_params =
    function()
    {
		//		  parameters  PBKDF2-params ::= SEQUENCE {
		//			 salt            CHOICE {
		//								specified OCTET STRING { ... }
		//								otherSource AlgorithmIdentifier {{PBKDF2-SaltSources}}
		//							 }
		//			 iterationCount  INTEGER { 1..MAX }
		//			 keyLength       INTEGER { 1..MAX } OPTIONAL
		//			 prf             AlgorithmIdentifier {{ PBKDF2-PRFS }} DEFAULT id-hmacWithSHA1
		//		  }
		//	 }

		//	 encryptionScheme    AlgorithmIdentifier ::= SEQUENCE {
		//		symAlg   OBJECT IDENTIFIER { ... }
		//		iv       OCTET STRING      { ... }
		//	 }
        var names = in_window.org.pkijs.getNames(arguments[0]);
		
        return (new in_window.org.pkijs.asn1.SEQUENCE({
            name: (names.block_name || ""),
            value: [
			    new in_window.org.pkijs.asn1.OID({ name: (names.EncAlgWPBKDF2params || "keyDerivationFunc") }),
                in_window.org.pkijs.schema.cms.PBKDF2_params(names.parameters || {
                    names: {
                        block_name: (names.keyDevParams || "")
                    }
                })
            ]
        }));
    }
	
    //**************************************************************************************
    // #endregion 
 
	
 
}
)(typeof exports !== "undefined" ? exports : window);