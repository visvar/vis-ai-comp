# Visualization for AI-Assisted Composing 
#### Click on the teaser image to try the prototype yourself
[<img src="https://github.com/visvar/vis-ai-comp/blob/main/Material/TeaserImage.png">](https://visvar.github.io/vis-ai-comp/)
#### Click on the teaser image to try the prototype yourself 

#### Top 
Piano Roll allows to control the composition via notewise editing. User can also edit suggestion samples.

#### Bottom Left
Icicle plot with detailed piano rolls shows the graph structure and therefore continuation and fill-ins. All children (continuations) split the height of the parent equally. Therefore, the X-axis shows the relationship of to samples, as well as a common timeline.
Each node has an individual Y-axis, because height varies with number of samples.

#### Bottom Middle
Node-Link with simple piano rolls shows the same structure as **B**. Relationship between samples are displayed through links, allowing sorting by different metrics. The metric value is also encoded in the width of the link.

#### Bottom Right
Similarity-based scatterplot uses a similarity metric and dimensionality reduction to cluster and show many samples at once. In this scatterplot, samples are placed so similar samples are near each other. The similarity metric considers rhythm and melodic structure independently and combines them using a user chosen weight. Groups can be selected using the circular brush and inspected with the additional aggregations and visualizations. In order to get information about the samples directly in the scatterplot, users can change the representation to glyphs (small symbols which represent some kind of data visually). Gridifing the scatterplot helps avoiding overlap and clutter of glyphs.

#### Additional View not shown in Figure
A correlation matrix and the corresponding scatterplot shows our different metrics and allow for pairwise analysis. By selecting an area in the matrix and the two metrics, all samples are shown in the scatterplot as point, where position represents these two metrics. One Example could be to inspect the relationship between parameters like temperature
and metrics like similarity. Some examples are shown in the paper or the supplemental material.

### [Supplemental Material](https://github.com/visvar/vis-ai-comp/blob/main/Material/supplementalMaterial.pdf "Supplemental Material for our paper, including additional information, images, and answers to questions.")
<!---  
Where supplemental Material? Google Doc and link? or Github folder with pictures and file? or directly here?
--->
In our Supplemental Material we provide additional information about our [Paper](https://github.com/visvar/vis-ai-comp/blob/main/Material/ISMIR_2022_Human_AI_Composition2411.pdf). This includes an extended version of our evaluation, additional images showing different scenarios of visualizations or underlining the concepts mentioned in our Paper. Further, we answer some interesting questions to add information to our Paper and amplify understanding.
We also provide our [Presentation slides](https://github.com/visvar/vis-ai-comp/blob/main/Material/slides.pdf), a video of them [Video](https://www.youtube.com/watch?v=EN0FZW5tdbI) ([Download](https://github.com/visvar/vis-ai-comp/blob/main/Material/video.mp4)) and our [Poster](https://github.com/visvar/vis-ai-comp/blob/main/Material/poster.pdf), which we all presented at ISMIR 2022.

### Information on using the prototype
#### Click on the teaser image to try the prototype yourself on our hosted website

##### Help when starting
For starting, you can record a melody by clicking on the *Mic* button and then playing a melody with the keyboard or a midi device. The keyboard can record the keys \*a = C4*, *w = C#4* ... until *l = D5*. \To stop recording press the *Mic* button again.\
Edit single notes in the large Piano roll (**A**) with drag and drop or draw a rectangle with left mouseclick to select multiple notes and drag the whole group. Adjust the duration of a note by hovering the right edge of a note and drag it to the desired duration.\
Select a predicting model by choosing one from the preloaded list or add a file with reference to a server with another model.\
Then generate multiple continuations through the *Generate* tab and use the parameters to specify: temperature = randomnes in magenta models.\
The model takes the whole composition into account unless there are continuations already, then these are used as seed. If there is not composition, users can generate continuations using some example melodies as seeds to allow for a quick start. These example melodies can be chosen in the *Generate* tab but can be ignored once a composition is started.\
Investigate the possiblities with our visualization and repeat the previous steps to your desire.\
To generate fill-ins (replacing a part in the composition with AI suggestions), users have to brush the part they want to replace (only the time component of the brush will be used) and the have to *fill-in* in the *Generate* tab.\

##### Some minor tipps when using
Right click on a piano roll to play the sample.\
Brush and *N* to create new note.\
Hold a note with left click and *C* to copy that note. Click *V* to paste the copied note.\


### Authors 
[Simeon Rau](https://visvar.github.io/members/simeon_rau.html), [Frank Heyen](https://visvar.github.io/members/frank_heyen.html), and [Michael Sedlmair](https://visvar.github.io/members/michael_sedlmair.html) from the [VISVAR](https://visvar.github.io/) group at [VISUS](https://www.visus.uni-stuttgart.de/) and [Stefan Wagner](https://www.iste.uni-stuttgart.de/institute/team/Wagner-00017/) from [ISTE](https://www.iste.uni-stuttgart.de/), both institutes at the [University of Stuttgart](https://www.uni-stuttgart.de/).

### Citation:

```
@inproceedings{rau2022visualization,
  author       = {Simeon Rau and
                  Frank Heyen and
                  Stefan Wagner and
                  Michael Sedlmair},
  title        = {Visualization for AI-Assisted Composing},
  booktitle    = {{Proceedings of the 23rd International Society for 
                   Music Information Retrieval Conference (ISMIR)}},
  year         = {2022},
  pages        = {151-159},
  publisher    = {ISMIR},
  address      = {Bengaluru, India},
  venue        = {Bengaluru, India},
  doi          = {10.5281/zenodo.7316618},
  url          = {https://doi.org/10.5281/zenodo.7316618}
}
```
