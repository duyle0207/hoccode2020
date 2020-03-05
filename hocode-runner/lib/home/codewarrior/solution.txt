
          package hello;

          import org.springframework.boot.autoconfigure.*;
          import org.springframework.stereotype.Controller;
          import org.springframework.web.bind.annotation.RequestMapping;
          import org.springframework.web.bind.annotation.ResponseBody;

          @Controller
          @EnableAutoConfiguration
          public class HomeController {

              @RequestMapping("/")
              public @ResponseBody String greeting() {
                  return "Hello World";
              }

          }