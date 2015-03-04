describe('Position', function(){

  document.body.innerHTML = __html__['html/test.html'];

  describe('#height()', function(){
    it('should return value greater than zero', function(){
      var h = $('#wrapper').height();
      expect(h).to.be.above(0);
    })
  })

  describe('#width()', function(){
    it('should return value greater than zero', function(){
      var w = $('#wrapper').width();
      expect(w).to.be.above(0);
    })
  })

  describe('#innerHeight()', function(){
    it('should return value greater than zero', function(){
      var h = $('#wrapper').innerHeight();
      expect(h).to.be.above(0);
    })
  })

  describe('#innerWidth()', function(){
    it('should return value greater than zero', function(){
      var w = $('#wrapper').innerWidth();
      expect(w).to.be.above(0);
    })
  })

})

