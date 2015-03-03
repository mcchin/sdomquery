var tempValue = '';

describe('Events', function(){

  document.body.innerHTML = __html__['html/test.html'];

  describe('#click()', function(){
    it('should get the value "clicked" when mouse click is simulated', function(){
      $('#event').click(function() {
        tempValue = 'clicked';
      });
      effroi.mouse.click($('#event')[0]);
      assert.equal('clicked', tempValue);
    })
  })

  describe('#dblclick()', function(){
    it('should get the value "dblclicked" when mouse double click is simulated', function(){
      $('#event').dblclick(function() {
        tempValue = 'dblclicked';
      });
      effroi.mouse.dblclick($('#event')[0]);
      assert.equal('dblclicked', tempValue);
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

