Element.addMethods({
	qrcode : function(element, options){
		// if options is string,
		if(Object.isString(options))
			options = {text: options} ;
		// set default values
		// typeNumber < 1 for automatic calculation
		options	= Object.extend({
			render		: "canvas",
			width		: 256,
			height		: 256,
			typeNumber	: -1,
			correctLevel	: QRErrorCorrectLevel.H,
			background      : "#ffffff",
			foreground      : "#000000"
		}, options);

		var createCanvas	= (function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();

			// create canvas element
			var canvas	= document.createElement('canvas');
			canvas.width	= options.width;
			canvas.height	= options.height;
			var ctx		= canvas.getContext('2d');

			// compute tileW/tileH based on options.width/options.height
			var tileW	= options.width  / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the canvas
			for( var row = 0; row < qrcode.getModuleCount(); row++ ){
				for( var col = 0; col < qrcode.getModuleCount(); col++ ){
					ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
					var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
					var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
					ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);
				}
			}
			// return just built canvas
			return canvas;
		});

		// from Jon-Carlos Rivera (https://github.com/imbcmdth)
		var createTable	= (function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();

			// create table element
			var $table	= new Element('table').setStyle({
				width: options.width+"px",
				height: options.height+"px",
				border : "0px",
				borderCollapse : "collapse",
				backgroundColor : options.background
			}) ;

			// compute tileS percentage
			var tileW	= options.width / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the table
			for(var row = 0; row < qrcode.getModuleCount(); row++ ){
				$table.insert($tr = new Element('tr', {style : {height : tileH+"px"}}));

				for(var col = 0; col < qrcode.getModuleCount(); col++ ){
					$tr.insert(new Element('td').setStyle({
						width: tileW+"px",
						backgroundColor: qrcode.isDark(row, col) ? options.foreground : options.background
					}));
				}
			}
			// return just built canvas
			return $table;
		});
		element.insert($return = (options.render == "canvas" ? createCanvas() : createTable()));
		return $return ;
	}
});