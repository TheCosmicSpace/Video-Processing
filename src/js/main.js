let video,
  video2,
  result,
  ctx_result,
  tmp_result,
  ctx_tmp_result

const init = () => {
  video = document.querySelector('#preview')
  result = document.querySelector('#result')
  ctx_result = result.getContext('2d')

  video2 = document.createElement('video')
  video2.src = 'img/space.mov'
  video2.muled = true
  video2.autoplay = true
  video2.loop = true
  console.log(video2);
  


  tmp_result = document.createElement('canvas')
  ctx_tmp_result = tmp_result.getContext('2d')
  tmp_result.setAttribute('width', result.width)
  tmp_result.setAttribute('height', result.height)

  video.addEventListener('play', computeFrame)
}

const computeFrame = () => {
  ctx_tmp_result.drawImage(video,0,0,500,281)
  const frame = ctx_tmp_result.getImageData(0,0,500,281)

  ctx_tmp_result.drawImage(video2,0,0,500,281)
  const frame2 = ctx_tmp_result.getImageData(0,0,500,281)

  for(let i = 0; i < frame.data.length/4; i++){
    let r = frame.data[i * 4 + 0]
    let g = frame.data[i * 4 + 1]    
    let b = frame.data[i * 4 + 2]

    if(r > 30 && r < 110 && g > 160 && g < 254 && b > 5 && b < 100){
      frame.data[i * 4 + 0] = frame2.data[i * 4 + 0]
      frame.data[i * 4 + 1] = frame2.data[i * 4 + 1]
      frame.data[i * 4 + 2] = frame2.data[i * 4 + 2]
    }
  }

  ctx_result.putImageData(frame,0,0)
  setTimeout(computeFrame, 0)
}


document.addEventListener('DOMContentLoaded', init)
