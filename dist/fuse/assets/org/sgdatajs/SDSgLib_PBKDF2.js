/*
 * Copyright (c) 2015, SeguriData <www.seguridata.com>
 * Author 2015, adiaz <adiaz@seguridata.com>.
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

	function SgLib_PBKDF2(pwd_buffer, hexSalt, iterations, totalBits) {
		
		var saltBits = forge.util.hexToBytes(hexSalt);
		
		return new Promise(function(resolve, reject) {
			
			try {
				
				var derivedKey = forge.pkcs5.pbkdf2(pwd_buffer, saltBits, iterations, totalBits/8, "sha1")
				
				var hexKey = forge.util.bytesToHex( derivedKey );
				resolve(hexKey);
			} catch(err) {
				reject(err);
			}
		});
	}