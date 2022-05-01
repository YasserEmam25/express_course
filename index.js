const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

let courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'},
];

app.get('/', (req, res) => {
    res.send("404");
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c=> c.id === parseInt(req.params.id));

    // check if the course exists
    if (course) res.send(course);
    else res.status(404).send("The course does not exist")
})

app.post('/api/courses', async function (req, res)  {
    // input validation
    const result = validate(req.body);
    if (result) {
        res.status(200).send(result);
        const course = {
            id: courses.length+1,
            name: req.body.name
        };
        courses.push(course);
    }

});

// update course with 'put' request
app.put('/api/courses/:id', async (req, res) => {
    // search for course
    // if not found return 404
    console.log();
    if (req.params.id < 1 || req.params.id > courses.length) return res.status(404).send('Course not found');
    
    // Validate
    const result = await validate(req.body);
    if (result) {
        res.status(200).send(result);

        courses[req.params.id -1].name = result.name;
    }

})

//Delete request
app.delete('/api/courses/:id', function(req, res) {
    // look up for the course
    const course = courses.find(c=> c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send("Error: course not found");
    // Delete course
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})


// get PORT number
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`))



async function validate(input) {
    // schema for validation
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    try {
        return await schema.validateAsync(input);

    } catch (err) {
        console.log("error");
        res.status(400).send(err);
        return;
    } 

}
