var rasPathwayElements = {


  nodes : [

    {
      data: {"id":"n0:n0",
             "parent":"n0",
             "molecule": "Sos"}
    },


    {
      data: {"id":"n0:n1",
             "parent":"n0",
             "molecule": "RasGRP"}
    },


    {
      data: {"id":"n0:n2",
             "parent":"n0",
             "molecule": "RasGRF1"}
    },


    {
      data:{id:"n0",
            parent: ''}
    },


    {
      data:{"id": "n1",
            "parent":"",
            "molecule":"RTK"}
    },


    {
      data:{"id": "n2",
            "parent":"",
            "molecule":"Growth factors"}
    },


    {
      data:{"id": "n3",
            "parent":"",
            "molecule":"DAG"}
    },


    {
      data:{"id": "n4",
            "parent":"",
            "molecule":"NDMA-R"}
    },


    {
      data:{"id": "n5",
            "parent":"",
            "molecule":"NDMA"}
    }



  ],

  edges : [

    {
      data:{
        id: 'edge0',
        source: "n1",
        target: "n0:n0",
        evidence: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4290648/"
      }
    },


    {
      data:{
        id: 'edge1',
        source: "n2",
        target: "n1",
        evidence: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4290648/"
      }
    },


    {
      data:{
        id: 'edge2',
        source: "n3",
        target: "n0:n1",
        evidence: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4290648/"
      }
    },


    {
      data:{
        id: 'edge3',
        source: "n5",
        target: "n4",
        evidence: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4290648/"
      }
    },


    {
      data:{
        id: 'edge4',
        source: "n4",
        target: "n0:n2",
        evidence: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4290648/"
      }
    },




  ]


};
