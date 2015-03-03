describe('Events', function(){

  document.body.innerHTML = __html__['html/test.html'];

  describe('#eventindexOf()', function(){
    it('shouldx return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
    it('should xxreturn -1 when the value is not present', function(){
      document.body.innerHTML = __html__['html/test.html'];
      expect(document.getElementById('main')).to.not.be.undefined;
    })
  })

})

