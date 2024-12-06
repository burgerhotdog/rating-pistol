const templateCharacter = () => ({
  name: '',
  level: 1,
  constellation: 0,
  weapon: {
    name: '',
    level: 1,
    refinement: 1,
  },
  talents: {
    normal: 1,
    skill: 1,
    burst: 1,
  }
});

const templateArtifact = () => ({
  level: 1,
  set: '',
  mainStat: '',
  subStats: {},
});
  
export { templateArtifact, templateCharacter };
