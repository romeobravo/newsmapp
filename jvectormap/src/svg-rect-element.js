jvm.SVGRectElement = function(config, style){
  console.log('rect make');
  jvm.SVGRectElement.parentClass.call(this, 'path', config, style);
};
jvm.inherits(jvm.SVGRectElement, jvm.SVGShapeElement);

