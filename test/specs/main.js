describe('General', function(){

  document.body.innerHTML = __html__['html/test.html'];

  it('should contain more than one ".ele" elements', function(){
    var count = $('.ele').length;
    expect(count).to.be.at.least(1);
  })

})

