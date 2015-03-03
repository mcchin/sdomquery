describe('Css', function(){

  document.body.innerHTML = __html__['html/test.html'];

  describe('#addClass("new-class")', function(){
    it('should contain the string "new-class" after adding', function(){
      $('#elementTop').addClass('new-class');
      expect($('#elementTop').attr('class')).to.have.string('new-class');
    })
  })

  describe('#removeClass("top")', function(){
    it('should not contain the string "top" after removing', function(){
      $('#elementTop').removeClass('top');
      expect($('#elementTop').attr('class')).to.not.have.string('top');
    })
  })

  describe('#hasClass("ele")', function(){
    it('should return true when checking if element contain class "ele"', function(){
      expect($('#elementTop').hasClass('ele')).to.be.true;
    })
  })

  describe('#css("color")', function(){
    it('should return "red" when checking css style "color"', function(){
      expect($('#elementTop').css('color')).to.have.string('red');
    })
  })

  describe('#css("color", "green")', function(){
    it('should return "green" when updating css style "color"', function(){
      $('#elementTop').css('color', 'green');
      expect($('#elementTop').css('color')).to.have.string('green');
    })
  })

  describe('#css({"color": "black", "backgroundColor": "blue"})', function(){
    it('should return color "black" and backgroundColor "blue" when updating css style by passing object', function(){
      $('#elementTop').css({"color": "black", "backgroundColor": "blue"});
      expect($('#elementTop').css('color')).to.have.string('black');
      expect($('#elementTop').css('backgroundColor')).to.have.string('blue');
    })
  })

  describe('#styles()', function(){
    it('should return color "black" and backgroundColor "blue" when checking styles', function(){
      var style = $('#elementTop').styles();
      expect(style['color']).to.have.string('rgb(0, 0, 0)');
      expect(style['background-color']).to.have.string('rgb(0, 0, 255)');
    })
  })

})

