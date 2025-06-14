import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

//This allows the programmer to edit the meta data
export function meta({}: Route.MetaArgs) {
  return [
    //The title is the top portion of the website
    { title: "Homepage" },
    //Adds a meta tag for the description
    //A meta tag is an html element that provides meta data. 
    { name: "description", content: "This is the welcome page. It should include items such as description and photo" },
  ];
}

//This is the actual content of the website
//It is being rendered in a seperate location
export default function Home() {
  return <Welcome />;
}
