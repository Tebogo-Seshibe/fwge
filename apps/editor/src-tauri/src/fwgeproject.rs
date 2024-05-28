// use serde::{Deserialize,Serialize};

// #[derive(Deserialize,)]
pub struct FWGEProject<'a> {
    project: &'a Project,
    scenes: &'a Vec<Scene>,
    entities: &'a Vec<Entity>,
    components: &'a Vec<Component>
}

pub struct Project {
}

pub struct Scene {
}

pub struct Entity {
}

pub struct Component {
}

impl FWGEProject<'_> {
    pub fn project(&self) -> &Project {
        &self.project
    }
    pub fn scenes(&self) -> &Vec<Scene> {
        &self.scenes
    }
    pub fn entities(&self) -> &Vec<Entity> {
        &self.entities
    }
    pub fn components(&self) -> &Vec<Component> {
        &self.components
    }
}