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

    // #region "org.pkijs.simpl" namespace 
    if(typeof in_window.org.pkijs.simpl === "undefined")
        in_window.org.pkijs.simpl = {};
    else
    {
        if(typeof in_window.org.pkijs.simpl !== "object")
            throw new Error("Name org.pkijs.simpl already exists and it's not an object" + " but " + (typeof in_window.org.pkijs.simpl));
    }
    // #endregion 

    // #region "org.pkijs.simpl.pkcs8" namespace 
    if(typeof in_window.org.pkijs.simpl.pkcs8 === "undefined")
        in_window.org.pkijs.simpl.pkcs8 = {};
    else
    {
        if(typeof in_window.org.pkijs.simpl.pkcs8 !== "object")
            throw new Error("Name org.pkijs.simpl.pkcs8 already exists and it's not an object" + " but " + (typeof in_window.org.pkijs.simpl.pkcs8));
    }
    // #endregion 

    // #region "local" namespace 
    var local = {};
    // #endregion   
    //**************************************************************************************
    // #endregion 
 
    
    //**************************************************************************************
    // #endregion 
    //**************************************************************************************
    // #region Simplified structure for "ENCRYPTED_PRIVATEKEY_INFO" type
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCRYPTED_PRIVATEKEY_INFO_WP52 =
    function()
    {
        // #region Internal properties of the object 
        this.encryptionAlgorithm = new in_window.org.pkijs.simpl.pkcs8.ENCRYPTIONALGORITHM();
        this.encryptedData = new in_window.org.pkijs.asn1.OCTETSTRING();
        // #endregion 

        // #region If input argument array contains "schema" for this object 
        if((arguments[0] instanceof Object) && ("schema" in arguments[0]))
            in_window.org.pkijs.simpl.pkcs8.ENCRYPTED_PRIVATEKEY_INFO_WP52.prototype.fromSchema.call(this, arguments[0].schema);
        // #endregion 
        // #region If input argument array contains "native" values for internal properties 
        else
        {
            if(arguments[0] instanceof Object)
            {
                this.encryptionAlgorithm = arguments[0].encryptionAlgorithm || new in_window.org.pkijs.simpl.pkcs8.ENCRYPTIONALGORITHM();
                this.encryptedData = arguments[0].encryptedData || new in_window.org.pkijs.asn1.OCTETSTRING();
            }
        }
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCRYPTED_PRIVATEKEY_INFO_WP52.prototype.fromSchema =
    function(schema)
    {
        // #region Check the schema is valid 
        var asn1 = in_window.org.pkijs.compareSchema(schema,
            schema,
            in_window.org.pkijs.schema.pkcs8.ENCRYPTED_PRIVATEKEY_INFO_WP52({
                names: {
                    encryptionAlgorithm: "encryptionAlgorithm",
                    encryptedData: "encryptedData"
                }
            })
            );

        if(asn1.verified === false)
            throw new Error("Object's schema was not verified against input data for ENCRYPTED_PRIVATEKEY_INFO_WP52");
        // #endregion 

        // #region Get internal properties from parsed schema 
        //this.encryptionAlgorithm = asn1.result["encryptionAlgorithm"].value_block.toString();
		this.encryptionAlgorithm = new in_window.org.pkijs.simpl.pkcs8.ENCRYPTIONALGORITHM({ schema: asn1.result["encryptionAlgorithm"] });
        this.encryptedData = asn1.result["encryptedData"];
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCRYPTED_PRIVATEKEY_INFO_WP52.prototype.toSchema =
    function()
    {
        // #region Construct and return new ASN.1 schema for this object 
        return (new in_window.org.pkijs.asn1.SEQUENCE({
            value: [
                this.encryptionAlgorithm.toSchema(),
                this.encryptedData
            ]
        }));
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCRYPTED_PRIVATEKEY_INFO_WP52.prototype.toJSON =
    function()
    {
        return {
            encryptionAlgorithm: this.encryptionAlgorithm.toJSON(),
            encryptedData: this.encryptedData.toJSON()
        };
    }
    //**************************************************************************************
    // #endregion 


    //**************************************************************************************
    // #region Simplified structure for "ENCRYPTIONALGORITHM" type 
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCRYPTIONALGORITHM =
    function()
    {
        // #region Internal properties of the object
		this.algorithm = new in_window.org.pkijs.asn1.OID();
        this.parameters = new in_window.org.pkijs.simpl.pkcs8.PARAMETERS();
        // #endregion 

        // #region If input argument array contains "schema" for this object 
        if((arguments[0] instanceof Object) && ("schema" in arguments[0]))
            in_window.org.pkijs.simpl.pkcs8.ENCRYPTIONALGORITHM.prototype.fromSchema.call(this, arguments[0].schema);
        // #endregion 
        // #region If input argument array contains "native" values for internal properties 
        else
        {
            if(arguments[0] instanceof Object)
            {
                this.algorithm = arguments[0].algorithm || new in_window.org.pkijs.asn1.OID();
				this.parameters = arguments[0].parameters || in_window.org.pkijs.simpl.pkcs8.PARAMETERS();
            }
        }
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCRYPTIONALGORITHM.prototype.fromSchema =
    function(schema)
    {
        // #region Check the schema is valid 
        var asn1 = in_window.org.pkijs.compareSchema(schema,
            schema,
            in_window.org.pkijs.schema.pkcs8.ENCRYPTIONALGORITHM({
                names: {
                    algorithm: "algorithm",
                    parameters: "parameters"
                }
            })
            );

        if(asn1.verified === false)
            throw new Error("Object's schema was not verified against input data for ENCRYPTIONALGORITHM");
        // #endregion 

        // #region Get internal properties from parsed schema 
		//this.algorithm = new in_window.org.pkijs.asn1.OID()({ schema: asn1.result["algorithm"] });
		this.algorithm = asn1.result["algorithm"];
		this.parameters = new in_window.org.pkijs.simpl.pkcs8.PARAMETERS({ schema: asn1.result["parameters"] });
		
        
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCRYPTIONALGORITHM.prototype.toSchema =
    function()
    {
        // #region Construct and return new ASN.1 schema for this object 
        return (new in_window.org.pkijs.asn1.SEQUENCE({
            value: [
                this.algorithm.toSchema(), //critico
                this.parameters.toSchema()
            ]
        }));
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCRYPTIONALGORITHM.prototype.toJSON =
    function()
    {
        return {
            algorithm: this.algorithm.toJSON(),
            parameters: this.parameters.toJSON()
        };
    }
    //**************************************************************************************
    // #endregion 	
	
	
	  //**************************************************************************************
    // #region Simplified structure for "PARAMETERS" type 
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.PARAMETERS =
    function()
    {
        // #region Internal properties of the object 
        this.EncAlgWPBKDF2params = new in_window.org.pkijs.simpl.pkcs8.ENCALG_WithPBKDF2_params();
		this.encryptionScheme = new in_window.org.pkijs.simpl.ALGORITHM_IDENTIFIER();
        // #endregion 

        // #region If input argument array contains "schema" for this object 
        if((arguments[0] instanceof Object) && ("schema" in arguments[0]))
            in_window.org.pkijs.simpl.pkcs8.PARAMETERS.prototype.fromSchema.call(this, arguments[0].schema);
        // #endregion 
        // #region If input argument array contains "native" values for internal properties 
        else
        {
            if(arguments[0] instanceof Object)
            {
                this.EncAlgWPBKDF2params = arguments[0].EncAlgWPBKDF2params || new in_window.org.pkijs.simpl.pkcs8.ENCALG_WithPBKDF2_params();
				this.encryptionScheme = arguments[0].encryptionScheme || new in_window.org.pkijs.simpl.ALGORITHM_IDENTIFIER();
            }
        }
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.PARAMETERS.prototype.fromSchema =
    function(schema)
    {
        // #region Check the schema is valid 
        var asn1 = in_window.org.pkijs.compareSchema(schema,
            schema,
            in_window.org.pkijs.schema.pkcs8.PARAMETERS({
                names: {
                    EncAlgWPBKDF2params: "EncAlgWPBKDF2params",
                    encryptionScheme: "encryptionScheme"
                }
            })
            );

        if(asn1.verified === false)
            throw new Error("Object's schema was not verified against input data for PARAMETERS");
        // #endregion 

        // #region Get internal properties from parsed schema 
		this.EncAlgWPBKDF2params = new in_window.org.pkijs.simpl.pkcs8.ENCALG_WithPBKDF2_params({ schema: asn1.result["EncAlgWPBKDF2params"] });
		this.encryptionScheme = new in_window.org.pkijs.simpl.ALGORITHM_IDENTIFIER({ schema: asn1.result["encryptionScheme"] });
        
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.PARAMETERS.prototype.toSchema =
    function()
    {
        // #region Construct and return new ASN.1 schema for this object 
        return (new in_window.org.pkijs.asn1.SEQUENCE({
            value: [
                this.EncAlgWPBKDF2params.toSchema(),
                this.encryptionScheme.toSchema()
            ]
        }));
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.PARAMETERS.prototype.toJSON =
    function()
    {
        return {
            EncAlgWPBKDF2params: this.EncAlgWPBKDF2params.toJSON(),
            encryptionScheme: this.encryptionScheme.toJSON()
        };
    }
    //**************************************************************************************
    // #endregion 	
	

 
    //**************************************************************************************
    // #region Simplified structure for "ENCALG_WithPBKDF2_params" type 
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCALG_WithPBKDF2_params =
    function()
    {
        // #region Internal properties of the object 
		this.keyDerivationFunc = new in_window.org.pkijs.asn1.OID();
        this.keyDevParams = new in_window.org.pkijs.simpl.cms.PBKDF2_params();        
        // #endregion 

        // #region If input argument array contains "schema" for this object 
        if((arguments[0] instanceof Object) && ("schema" in arguments[0]))
            in_window.org.pkijs.simpl.pkcs8.ENCALG_WithPBKDF2_params.prototype.fromSchema.call(this, arguments[0].schema);
        // #endregion 
        // #region If input argument array contains "native" values for internal properties 
        else
        {
            if(arguments[0] instanceof Object)
            {
                this.keyDerivationFunc = arguments[0].keyDerivationFunc || new in_window.org.pkijs.asn1.OID();
                this.keyDevParams = arguments[0].keyDevParams || new in_window.org.pkijs.simpl.cms.PBKDF2_params();
            }
        }
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCALG_WithPBKDF2_params.prototype.fromSchema =
    function(schema)
    {
        // #region Check the schema is valid 
        var asn1 = in_window.org.pkijs.compareSchema(schema,
            schema,
            in_window.org.pkijs.schema.pkcs8.ENCALG_WithPBKDF2_params({
                names: {
                    keyDerivationFunc: "keyDerivationFunc",
                    keyDevParams: "keyDevParams"
                }
            })
            );

        if(asn1.verified === false)
            throw new Error("Object's schema was not verified against input data for ENCALG_WithPBKDF2_params");
        // #endregion 

        // #region Get internal properties from parsed schema 
		this.keyDerivationFunc = asn1.result["keyDerivationFunc"];
		this.keyDevParams = new in_window.org.pkijs.simpl.cms.PBKDF2_params({ schema: asn1.result["keyDevParams"] });
        
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCALG_WithPBKDF2_params.prototype.toSchema =
    function()
    {
        // #region Construct and return new ASN.1 schema for this object 
        return (new in_window.org.pkijs.asn1.SEQUENCE({
            value: [
                this.keyDerivationFunc.toSchema(),
                this.keyDevParams.toSchema()
            ]
        }));
        // #endregion 
    }
    //**************************************************************************************
    in_window.org.pkijs.simpl.pkcs8.ENCALG_WithPBKDF2_params.prototype.toJSON =
    function()
    {
        return {
            keyDerivationFunc: this.keyDerivationFunc.toJSON(),
            keyDevParams: this.keyDevParams.toJSON()
        };
    }
    //**************************************************************************************
    // #endregion 
	
	
	//*******************************----------------------------------------------------------

	

}
)(typeof exports !== "undefined" ? exports : window);