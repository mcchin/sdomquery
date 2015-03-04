describe('Manipulation', function(){
  
  document.body.innerHTML = __html__['html/test.html'];

  describe('#remove()', function(){
    it('should return be 0 when element is removed', function(){
      $('#remove').remove();
      assert.equal(0, $('#remove').length);
    })
    it('should return be 0 when element is removed with matched class "test"', function(){
      $('.remove').remove('.test');
      assert.equal(0, $('.remove').length);
    })
  })

  describe('#empty()', function(){
    it('should return be blank when element is emptied', function(){
      $('#empty').empty();
      assert.equal('', $('#empty')[0].innerHTML); 
    })
  })

  describe('#attr()', function(){
    it('should return "wrapper" when checking ID attribute', function(){
      var id = 'wrapper',
          foundId = '';
      foundId = $('#wrapper').attr('id');
      assert.equal(foundId, id);
    })
  })

})

