describe('Utils', function(){

  document.body.innerHTML = __html__['html/test.html'];

  describe('#each()', function(){
    it('should be able to loop through all ".ele" elements', function(){
      var total = $('.ele').length,
          count = 0;

      $('.ele').each(function() {
        count++;
      });

      assert.equal(total, count); 
    })

    it('should return 15 when looping through array', function(){
      var arr = [1,2,3,4,5],
          count = 0; 

      $.each(arr, function(item, idx) {
        count += item;
      });

      assert.equal(15, count); 
    })
  })

  describe('#extend()', function(){
    it('should be able to merge objects', function(){
      var main = { main: 1 },
          sub1 = { sub1: 2 },
          sub2 = { sub2: 3 }; 

      $.extend(main, sub1, sub2);
  
      assert.equal(1, main.main); 
      assert.equal(2, main.sub1); 
      assert.equal(3, main.sub2); 
    })
  })

  describe('#isNumeric()', function(){
    it('should return true for numeric values', function(){
      assert.equal(true, $.isNumeric('2')); 
      assert.equal(true, $.isNumeric(2)); 
      assert.equal(true, $.isNumeric(2.1)); 
      assert.equal(true, $.isNumeric('2.1')); 
    })
    it('should return false for non-numeric values', function(){
      assert.equal(false, $.isNumeric('2a')); 
      assert.equal(false, $.isNumeric('2.1a')); 
      assert.equal(false, $.isNumeric('a')); 
      assert.equal(false, $.isNumeric(true)); 
    })
  })

  describe('#isFunction()', function(){
    it('should return true for function variable', function(){
      var func1 = function() {};
      function func2() {};
      assert.equal(true, $.isFunction(func1)); 
      assert.equal(true, $.isFunction(func2)); 
      assert.equal(true, $.isFunction(function() {})); 
    })
    it('should return false for non-function variable', function(){
      assert.equal(false, $.isFunction({})); 
      assert.equal(false, $.isFunction([])); 
      assert.equal(false, $.isFunction(true)); 
      assert.equal(false, $.isFunction('a')); 
      assert.equal(false, $.isFunction(2)); 
    })
  })

  describe('#isArray()', function(){
    it('should return true for array', function(){
      var arr = [1,2,3];
      assert.equal(true, $.isArray([])); 
      assert.equal(true, $.isArray(arr)); 
    })
    it('should return false for non-array', function(){
      var obj = {main:1};
      assert.equal(false, $.isArray({})); 
      assert.equal(false, $.isArray(obj)); 
      assert.equal(false, $.isArray(true)); 
      assert.equal(false, $.isArray('a')); 
      assert.equal(false, $.isArray(2)); 
      assert.equal(false, $.isArray(function(){})); 
    })
  })

  describe('#isPlainObject()', function(){
    it('should return true for {}', function(){
      var obj = {main:1};
      assert.equal(true, $.isPlainObject({})); 
      assert.equal(true, $.isPlainObject(obj)); 
    })
    it('should return false for non-{}', function(){
      var arr = [1,2,3];
      assert.equal(false, $.isPlainObject([]));
      assert.equal(false, $.isPlainObject(arr));
      assert.equal(false, $.isPlainObject(true));
      assert.equal(false, $.isPlainObject('a'));
      assert.equal(false, $.isPlainObject(2));
      assert.equal(false, $.isPlainObject(function(){}));
    })
  })

  describe('#isEmpty()', function(){
    it('should return true for blank object or array', function(){
      assert.equal(true, $.isEmpty({})); 
      assert.equal(true, $.isEmpty([])); 
    })
    it('should return false for array or object with values', function(){
      assert.equal(false, $.isEmpty([1,2,3]));
      assert.equal(false, $.isEmpty({main:1}));
    })
  })

})

