const express = require('express');
const webapp = express();
webapp.use(express.json());
const Joi = require('joi');

const courses = [
    {id:1, name:'Fisika'},
    {id:2, name:'Kimia'},
    {id:3, name:'Biologi'},
];

webapp.get('/', (req, res) => {
    res.send('Hello World');
});

webapp.get('/api/courses', (req, res) => {
    res.send(courses);
});

webapp.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

webapp.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course Not Found');

    const {error} = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return  Joi.validate(course, schema);
}

webapp.get('/api/courses/:id', (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if(!course) return res.status(404).send('Course Not Found');
   res.send(course);
}); 

webapp.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course Not Found');

    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
});

const port = process.env.PORT || 2000
webapp.listen(port, () => console.log(`Listening on port ${port}...`));
