var tempValue = '',
    clickCount = 0;

describe('Events', function(){

  document.body.innerHTML = __html__['html/test.html'];

  describe('#click()', function(){
    it('should get the value "clicked" when mouse click is simulated', function(){
      clickCount = 0;
      $('#event').click(function() {
        tempValue = 'clicked';
        clickCount++;
      });
      effroi.mouse.click($('#event')[0]);
      //assert.equal('clicked', tempValue);
      assert.equal(1, clickCount);
    })
  })

  describe('#dblclick()', function(){
    it('should get the value "dblclicked" when mouse double click is simulated', function(){
      clickCount = 0;
      $('#event').dblclick(function() {
        tempValue = 'dblclicked';
      });
      effroi.mouse.dblclick($('#event')[0]);
      //assert.equal('dblclicked', tempValue);
      assert.equal(2, clickCount);
    })
  })

  /*
  describe('#mouseover()', function(){
    it('should get the value "mouseover" when mouse over is simulated', function(){
      $('#event').mouseover(function() {
        tempValue = 'mouseover';
      });
      effroi.mouse.moveTo($('#event')[0]);
      assert.equal('mouseover', tempValue);
    })
  })
  */

})

