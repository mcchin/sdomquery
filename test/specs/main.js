describe('General', function(){
  document.body.innerHTML = __html__['html/test.html'];
  expect(document.getElementById('main')).to.not.be.undefined;

  describe('1#xaddClass()', function(){
    it('should contain the string "new-class" after adding', function(){
      console.log('[' + $('#elementTop').attr('class') + ']');
    })
  })

  describe('1#xremoveClass()', function(){
    it('should not contain the string "top" after removing', function(){
    })
  })
})

