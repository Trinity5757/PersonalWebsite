import type { Route } from "./+types/projects";
import {project as ProjectComponent} from '../Projects/project';

export function meta({}: Route.MetaArgs) {
  return [
    //The title is the top portion of the website
    { title: "Projects" },
    //Adds a meta tag for the description
    //A meta tag is an html element that provides meta data. 
    { name: "description", content: "This is the projects page. There should be a list of projects that I have completed" },
  ];
}

export default function projects() {
  return <ProjectComponent/>;
}