export const SAMPLE_INVENTORY = [
    {
        id: 'sample-1',
        name: 'Classic White Tee',
        category: 'Top',
        subType: 'T-Shirt',
        color: 'White',
        season: 'All',
        isClean: true,
        price: '25.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'sample-2',
        name: 'Black Slim Jeans',
        category: 'Bottom',
        subType: 'Jeans',
        color: 'Black',
        season: 'All',
        isClean: true,
        price: '60.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'sample-3',
        name: 'Denim Jacket',
        category: 'Outerwear', // Note: InventoryGrid might not have Outerwear filter, defaults to All? Or maybe should be Top? keeping as Outerwear for now, might need to map to Top if filter is strict.
        subType: 'Jacket',
        color: 'Blue',
        season: 'Cool',
        isClean: true,
        price: '85.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'sample-4',
        name: 'Chunky Sneakers',
        category: 'Shoes',
        subType: 'Sneakers',
        color: 'White',
        season: 'All',
        isClean: true,
        price: '90.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'sample-5',
        name: 'Beige Chinos',
        category: 'Bottom',
        subType: 'Chinos',
        color: 'Beige',
        season: 'All',
        isClean: true,
        price: '45.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'sample-6',
        name: 'Navy Blue Hoodie',
        category: 'Top',
        subType: 'Hoodie',
        color: 'Navy',
        season: 'Cool',
        isClean: true,
        price: '55.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'sample-7',
        name: 'Leather Chelsea Boots',
        category: 'Shoes',
        subType: 'Boots',
        color: 'Brown',
        season: 'Cool',
        isClean: true,
        price: '120.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'sample-8',
        name: 'Graphic Band Tee',
        category: 'Top',
        subType: 'T-Shirt',
        color: 'Black',
        season: 'warm',
        isClean: true,
        price: '30.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'sample-9',
        name: 'Grey Sweatpants',
        category: 'Bottom',
        subType: 'Sweatpants',
        color: 'Grey',
        season: 'Cool',
        isClean: true,
        price: '40.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1584370848010-d7cc637703ef?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'sample-10',
        name: 'Dad Hat',
        category: 'Accessory',
        subType: 'Hat',
        color: 'Green',
        season: 'All',
        isClean: true,
        price: '20.00',
        wearCount: 0,
        dateAdded: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=500'
    }
];

export const SAMPLE_WISHLIST = [
    {
        id: 'wish-1',
        name: 'Varsity Jacket',
        category: 'Outerwear',
        subType: 'Jacket',
        color: 'Red',
        season: 'Cool',
        price: '150.00',
        notes: 'Classic vibe',
        image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'wish-2',
        name: 'Silk Scarf',
        category: 'Accessory',
        subType: 'Scarf',
        color: 'Gold',
        season: 'All',
        price: '85.00',
        notes: 'For formal events',
        image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'wish-3',
        name: 'High Top Converses',
        category: 'Shoes',
        subType: 'Sneakers',
        color: 'Black',
        season: 'All',
        price: '65.00',
        notes: 'Beatters',
        image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&q=80&w=500'
    }
];
