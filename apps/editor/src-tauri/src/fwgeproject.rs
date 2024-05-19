use serde::{Deserialize,Serialize};

#[derive(Deserialize)]
pub struct FWGEProject {
    project: &Project,
    scenes: &Vec<Scene>,
    entities: &Vec<Entity>,
    components: &Vec<Component>
}

pub struct Project {
}

pub struct Scene {
}

pub struct Entity {
}

pub struct Component {
}

impl FWGEProject {
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