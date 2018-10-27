/*
 * Test for GeoParsers
 */
 
 describe('GeoParsers', function() {
	it('should expose a TerraFly Object', function() {
		expect(TerraFly).to.be.a('object');
	});
	describe('WKT', function() {
		it('should be exposed in TerraFly', function() {
			expect(TerraFly.WKT).to.be.a('object');
		});
		it('should expose a parse function', function() {
			expect(TerraFly.WKT.parse).to.be.a('function');
		});
		describe('#parse()', function() {
			it('should parse Point WKT', function() {
			
			    expect(TerraFly.WKT.parse("POINT (30 10)"))
					.to.eql({ "type": "Point", "coordinates": [30, 10] });
			});
			it('should parse LineString WKT', function () {

			    expect(TerraFly.WKT.parse("LINESTRING (30 10, 10 30, 40 40)"))
                    .to.eql({ "type": "LineString", "coordinates": [[30, 10], [10, 30], [40, 40]] });
			});
			it('should parse Polygon WKT', function() {
			    expect(TerraFly.WKT.parse("POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))"))
					.to.eql({ "type": "Polygon", "coordinates": [[[30, 10], [10, 20], [20, 40], [40, 40], [30, 10]]]});
			});
			it('should parse Polygon WKT with holes', function () {
			    expect(TerraFly.WKT.parse("POLYGON ((35 10, 10 20, 15 40, 45 45, 35 10), (20 30, 35 35, 30 20, 20 30))"))
                    .to.eql({ "type": "Polygon", "coordinates": [[[35, 10], [10, 20], [15, 40], [45, 45], [35, 10]], [[20, 30], [35, 35], [30, 20], [20, 30]]] });
			});
			it('should parse MultiPoint WKT', function () {
			    expect(TerraFly.WKT.parse("MULTIPOINT ((10 40), (40 30), (20 20), (30 10))"))
                    .to.eql({ "type": "MultiPoint", "coordinates": [[10, 40], [40, 30], [20, 20], [30, 10]] });
			});
			it('should parse MultiLineString WKT', function () {
			    expect(TerraFly.WKT.parse("MULTILINESTRING ((10 10, 20 20, 10 40), (40 40, 30 30, 40 20, 30 10))"))
                    .to.eql({ "type": "MultiLineString", "coordinates": [[[10, 10], [20, 20], [10, 40]], [[40, 40], [30, 30], [40, 20], [30, 10]]] });
			});
			it('should parse MultiPolygon WKT', function() {
			    expect(TerraFly.WKT.parse("MULTIPOLYGON (((30 20, 10 40, 45 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))"))
                    .to.eql({ "type": "MultiPolygon", "coordinates": [[[[30, 20], [10, 40], [45, 40], [30, 20]]], [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]]] });
			});
		});
	});
	describe('GeoJSON', function() {
		it('should be exposed in TerraFly', function() {
			expect(TerraFly.GeoJSON).to.be.a('object');
		});
		it('should expose a parse function', function() {
			expect(TerraFly.GeoJSON.parse).to.be.a('function');
		});
		
		describe('#parse()', function() {
			it('should parse GeoJSON', function() {
			
			});
		});
	});
});