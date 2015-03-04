describe('Traverse', function(){

  document.body.innerHTML = __html__['html/test.html'];

  describe('#find()', function(){
    it('should be able to find ".ele"', function(){
      var total = $('.ele').length,
          count = -1;

      count = $('#wrapper').find('.ele').length;
      assert.equal(count, total); 
    })
  })

  describe('#has()', function(){
    it('should be able to determine if <ul> has <li>', function(){
      var count = -1;

      count = $('#list').has('li').length;
      expect(count).to.be.above(0);

      count = $('#blankList').has('li').length;
      expect(count).to.be.below(1);
    })
  })

  describe('#children()', function(){
    it('should be able to find ".ele" in "#wrapper"', function(){
      var total = $('.ele').length,
          count = -1;

      count = $('#wrapper').children('.ele').length;
      assert.equal(count, total); 
    })
  })

  describe('#parent()', function(){
    it('should be able to determine ".ele" parent is "#wrapper"', function(){
      var id = 'wrapper',
          foundId = ''; 

      foundId = $('.ele').parent().attr('id');
      assert.equal(foundId, id); 
    })
  })

  describe('#first()', function(){
    it('should return first element of "#wrapper" - "#elementTop"', function(){
      var id = 'elementTop',
          foundId = ''; 

      foundId = $('.ele').first().attr('id');
      assert.equal(foundId, id); 
    })
  })

  describe('#last()', function(){
    it('should return last element of "#wrapper" - "#elementBottom"', function(){
      var id = 'elementBottom',
          foundId = ''; 

      foundId = $('.ele').last().attr('id');
      assert.equal(foundId, id); 
    })
  })

  describe('#next()', function(){
    it('should return next element of ".ele" - "#event"', function(){
      var id = 'event',
          foundId = ''; 

      foundId = $('.ele').next().attr('id');
      assert.equal(foundId, id); 
    })
  })

  describe('#prev()', function(){
    it('should return prev element of ".ele" - "#event"', function(){
      var id = 'event',
          foundId = ''; 

      foundId = $('.ele').next().next().prev().attr('id');
      assert.equal(foundId, id); 
    })
  })

  describe('#get()', function(){
    it('should return first element of "#wrapper" - "#elementTop"', function(){
      var id = 'elementTop',
          foundId = ''; 

      foundId = $('.ele').get(0).attr('id');
      assert.equal(foundId, id); 
    })
  })

})
