const browseButton=document.querySelector('.browse_button');
const previousButton=document.querySelector('.previous_button');
const nextButton=document.querySelector('.next_button');
let previousViewer=document.querySelector('.previous_viewer');
let currentViewer=document.querySelector('.current_viewer');
let nextViewer=document.querySelector('.next_viewer');
let previousIndex=-1;
let currentIndex=0;
let nextIndex=1;
let images=[];
let isAnimating=false;
browseButton.onclick=async function()
{
	try
	{
		const directoryHandle=await window.showDirectoryPicker();
		images=[];
		for await(const entry of directoryHandle.values())
		{
			if(entry.kind=='file')
			{
				const file=await entry.getFile();
				if(file.type.startsWith('image/')){
					images.push(file);
				}
			}
		}
		if(images.length>0)
		{
			previousButton.style.opacity='100%';
			nextButton.style.opacity='100%';
			previousIndex=images.length-1;
			currentIndex=0;
			nextIndex=images.length==1?0:1;
			updateImage(previousViewer,previousIndex);
			updateImage(currentViewer,currentIndex);
			updateImage(nextViewer,nextIndex);
		}
		else{
			alert("no images in that directory");
		}
	}
	catch(error){
		alert(error);
	}
}
function updateImage(viewer,index)
{
	viewer.src=URL.createObjectURL(images[index]);
}
previousButton.onclick=function()
{
	if(images.length==0)
		return;
	if(isAnimating)
		return;
	isAnimating=true;
	currentViewer.classList.add('exit_left');
	nextViewer.classList.add('enter_left');
	currentViewer.addEventListener('animationend',function handler(){
		currentViewer.removeEventListener('animationend',handler);
		currentViewer.classList.remove('exit_left');
		nextViewer.classList.remove('enter_left');
		previousIndex=currentIndex;
		currentIndex=nextIndex;
		nextIndex=(nextIndex+1)%images.length;
		URL.revokeObjectURL(previousViewer.src);
		previousViewer.src=currentViewer.src;
		currentViewer.src=nextViewer.src;
		updateImage(nextViewer,nextIndex);
		isAnimating=false;
	},{once:true});
}
nextButton.onclick=function()
{
	if(images.length==0)
		return;
	if(isAnimating)
		return;
	isAnimating=true;
	previousViewer.classList.add('enter_right');
	currentViewer.classList.add('exit_right');
	currentViewer.addEventListener('animationend',function handler(){
		currentViewer.removeEventListener('animationend',handler);
		previousViewer.classList.remove('enter_right');
		currentViewer.classList.remove('exit_right');
		nextIndex=currentIndex;
		currentIndex=previousIndex;
		previousIndex--;
		if(previousIndex==-1){
			previousIndex=images.length-1;
		}
		nextIndex=(nextIndex+1)%images.length;
		URL.revokeObjectURL(nextViewer.src);
		nextViewer.src=currentViewer.src;
		currentViewer.src=previousViewer.src;
		updateImage(previousViewer,previousIndex);
		isAnimating=false;
	},{once:true});
}