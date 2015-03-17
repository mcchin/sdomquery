describe('Data', function(){

  document.body.innerHTML = __html__['html/test.html'];

  describe('#data("test", "test")', function(){
    it('should get the value "test" after writing to body', function(){
      var tmp = '',
          val = 'test',
          key = 'test';

      $('body').data(key, val);
      tmp = $('body').data(key);
      assert.equal(tmp, val);
    })
  })

})

