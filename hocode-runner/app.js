const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const port = 8080
var run = require('./lib/runner').run
const router = express.Router()

var code = `public class Solution {

    public Solution() {}

    public int testthing() {
        return 3;
    }

}`;

var test = `import static org.junit.Assert.assertEquals;
import org.junit.Test;
import org.junit.runners.JUnit4;

public class TestFixture {
    public TestFixture() {}
    @Test
    public void myTestFunction() {
        Solution s = new Solution();
        assertEquals("conghaiso 2,2", 4, s.conghaiso(2, 2));
        assertEquals("conghaiso 1,2", 3, s.conghaiso(1, 2));
        assertEquals("conghaiso 100,101", 201, s.conghaiso(100, 101));
    }
}`;

// router.get('/', (req, res) => {
//     console.log("Hello index");
//     res.sendFile(path.join(__dirname + '/index.html'));

// })

router.post('/', function (req, res) {
    run({
        language: 'java',
        code: code,
        fixture: test
    }, function (buffer) {
        res.json(buffer);
    });
})
// app.use(cookieParser())
app.use(bodyParser.json())

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))