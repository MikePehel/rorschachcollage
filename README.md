# rorshachcollage

This Photoshop script selects from a collection of images and places them relative to each other on a canvas. It was originally used to design dozens of t-shirts for my website [snice.shop](snice.shop), and hopefully you can use it to make some of your own designs. All of the images used are public domain, so feel free to tweak and distribute as you see fit. The script is relatively adaptive and can adjust to different dimensions as seen in the example images below.

![Cat Collage](https://github.com/MikePehel/rorschachcollage/blob/master/images/Cat_Collage_Test.jpg "Cat Collage")
![Skull Collage Wide](https://github.com/MikePehel/rorschachcollage/blob/master/images/Skull_Collage_Test.jpg "Skull Collage")
![Antelope Collage Tall](https://github.com/MikePehel/rorschachcollage/blob/master/images/Antelope_Collage_Test.jpg "Antelope Collage")

## Getting Started

Since this is a Photoshop script, you might want to download [Adobe ExtendScript Toolkit](https://helpx.adobe.com/creative-cloud/kb/creative-cloud-apps-download.html). It will allow you to run the script through the program and debug. It's not the best interface, but does have the advantage of being fully integrated with the application. For more information about Photoshop scripting, read the [Photoshop CC Scripting Guide](http://wwwimages.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-scripting-guide-2015.pdf) and the [Photoshop CC JavaScript Reference](http://wwwimages.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-javascript-ref-2015.pdf).

## Prerequisites

* Make sure all the Actions and Patterns have been loaded into Photoshop or moved to the corresponding folder. They will have to be named correctly or changed accordingly in the script
* Photoshop CC (Any year)
* A sample list has been included which illustrates how to format the file queue for each composition. You will have to create your own list or use a random number to select which image files is chosen to fully utilize the script.

## Creating your First Collage

If you don't like reading. Check out this tutorial video:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=EXKCHgv0H80
" target="_blank"><img src="http://img.youtube.com/vi/EXKCHgv0H80/0.jpg" 
alt="rorschachcollage Tutorial Video" width="480" height="360" border="10" /></a>

1. Launch Photoshop
2. Load the script from File>Scripts>Browse.. or open the collageMaker.jsx file, select Photoshop from the application dropdown menu, and then hit the play button to run the script.
3. Let Photoshop do its business. The quantity and size of the files determines the time it will take to complete.
4. Presto! Your design is fully baked and ready to go. 
..* Send me your design at mikepehelgithub@gmail.com. I really want to see what you're able to make with the script.
