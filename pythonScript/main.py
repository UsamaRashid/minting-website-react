import json

for i in range(1, 27):
    data = {
        "name": chr(i + 64),
        "description": "This is a NFT collection of Alphabets Collectibles",
        "image": "ipfs://bafybeifjft3uqjkzk2tlqm6pupwoiks5n2mswhjlyy6fom7vk76sko6eti/"+str(i)+".png",

        "attributes": [
            {
                "trait_type": "Alphabet",
                "value": chr(i + 64)
            },
              {
                "trait_type": "Token ID",
                "value": str(i)
            },
        ]
    }
    
    with open(f"JsonFiles/{i}.json", "w") as json_file:
        json.dump(data, json_file, indent=4)
