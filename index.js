const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

let courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'},
]

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

    // if (!req.body.name) { 
    //     res.status(400).send('Name cant be empty.');
    //     return;
    // } else if (req.body.name.length < 3) {
    //     res.status(400).send('Name cant be less than 3 characters');
    //     return;
    // }

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    try {
        const value = await schema.validateAsync(req.body);
        res.status(200).send(value);

        const course = {
            id: courses.length+1,
            name: req.body.name
        };
        courses.push(course);
    } catch (err) {
        console.log("error");
        res.status(400).send(err);
    } 

});


// get PORT number
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`))
