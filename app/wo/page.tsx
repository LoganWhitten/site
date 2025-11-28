'use client'

import React, { useState, useRef, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface Item {
  id: number;
  name: string;
  category: string;
  active: number;
  spare: number;
  notes: string;
}

interface Category {
  name: string;
  notes: string;
  enableMultiPage: boolean;
}

interface CoverInfo {
  showTitle: string;
  lightingDesigner: string;
  lightingDesignerContact: string;
  productionElectrician: string;
  productionElectricianContact: string;
  venueName: string;
  venueAddress: string;
}

const initialItems: Item[] = [
    { id: 1, name: "", category: "", active: 0, spare: 0, notes: "" },
];

const initialCategories: Category[] = [
  { name: "Conventionals", notes: "", enableMultiPage: false },
  { name: "Automated Lights", notes: "", enableMultiPage: false },
  { name: "Cable", notes: "", enableMultiPage: false },
  { name: "Atmospherics", notes: "", enableMultiPage: false },
  { name: "Power Distribution", notes: "", enableMultiPage: false },
  { name: "Rigging/Iron", notes: "", enableMultiPage: false }
];

const ITEMS_KEY = 'werkorder-items';
const CATEGORIES_KEY = 'werkorder-categories';
const SELECTED_CATEGORY_KEY = 'werkorder-selected-category';
const COVER_KEY = 'werkorder-cover';

export default function WerkOrder() {
    const [items, setItems] = useState<Item[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(ITEMS_KEY);
            return saved ? JSON.parse(saved) : initialItems;
        }
        return initialItems;
    });
    const [categories, setCategories] = useState<Category[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(CATEGORIES_KEY);
            return saved ? JSON.parse(saved) : initialCategories;
        }
        return initialCategories;
    });
    const [categoryInput, setCategoryInput] = useState("");
    const [categoryNotes, setCategoryNotes] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(SELECTED_CATEGORY_KEY) || "";
        }
        return "";
    });
    const [categoryNotesOpen, setCategoryNotesOpen] = useState<string | null>(null);
    const [editCategory, setEditCategory] = useState<string | null>(null);
    const [editCategoryOpen, setEditCategoryOpen] = useState(false);
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const [editShowOpen, setEditShowOpen] = useState(false);
    const [enableMultiPageInput, setEnableMultiPageInput] = useState(false);
    const [localEnableMultiPage, setLocalEnableMultiPage] = useState(false);
    const [coverInfo, setCoverInfo] = useState<CoverInfo>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(COVER_KEY);
            return saved ? JSON.parse(saved) : {
                showTitle: '',
                lightingDesigner: '',
                lightingDesignerContact: '',
                productionElectrician: '',
                productionElectricianContact: '',
                venueName: '',
                venueAddress: ''
            };
        }
        return {
            showTitle: '',
            lightingDesigner: '',
            lightingDesignerContact: '',
            productionElectrician: '',
            productionElectricianContact: '',
            venueName: '',
            venueAddress: ''
        };
    });
    const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkCategoryOpen, setBulkCategoryOpen] = useState(false);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
    const nameRefs = useRef<Map<number, HTMLInputElement | null>>(new Map());
    const lastItemIndex = items.length - 1;

    const handleCategorySelect = (id: number, value: string) => {
        if (selectedIds.includes(id) && selectedIds.length > 1) {
            // Change category for all selected items
            setItems(items => items.map((item) => selectedIds.includes(item.id) ? { ...item, category: value } : item));
            setSelectedIds([]);
        } else {
            // Change category for single item
            setItems(items => items.map((item) => item.id === id ? { ...item, category: value } : item));
        }
        setOpenPopoverId(null);
    };

    const handleCategoryAdd = (id: number) => {
        if (selectedIds.includes(id) && selectedIds.length > 1) {
            // Add new category and assign to all selected items
            setCategories([...categories, { name: categoryInput, notes: categoryNotes, enableMultiPage: false }]);
            setItems(items => items.map((item) => selectedIds.includes(item.id) ? { ...item, category: categoryInput } : item));
            setSelectedIds([]);
        } else {
            // Add new category for single item
            if (categoryInput && !categories.some(c => c.name === categoryInput)) {
                setCategories([...categories, { name: categoryInput, notes: categoryNotes, enableMultiPage: false }]);
                setItems(items => items.map((item) => item.id === id ? { ...item, category: categoryInput } : item));
            }
        }
        setCategoryInput("");
        setCategoryNotes("");
        setOpenPopoverId(null);
    };

    const handleItemChange = (id: number, field: string, value: string | number) => {
        setItems(items => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleAddRowToCategory = (cat: string) => {
        const newId = Date.now();
        setItems(prev => [...prev, { id: newId, name: "", category: cat, active: 0, spare: 0, notes: "" }]);
    };

    const handleAddRow = () => {
        const category = selectedCategory || 'Uncategorized';
        handleAddRowToCategory(category);
    };

    const handleDelete = (id: number) => {
        setItems(items => items.filter(item => item.id !== id));
    };

    // Focus the name input of the last item when a new row is added
    useEffect(() => {
        const lastItem = items[items.length - 1];
        if (lastItem) {
            nameRefs.current.get(lastItem.id)?.focus();
        }
    }, [items.length]);

    // Keydown handler for Cmd/Ctrl+Enter
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleAddRow();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem(SELECTED_CATEGORY_KEY, selectedCategory);
    }, [selectedCategory]);

    useEffect(() => {
        localStorage.setItem(COVER_KEY, JSON.stringify(coverInfo));
    }, [coverInfo]);

    const getCategoryByName = (name: string) => categories.find(c => c.name?.toLowerCase() === name?.toLowerCase());

    const updateCategory = (name: string, field: keyof Category, value: any) => {
        const category = categories.find(c => c.name?.toLowerCase() === name?.toLowerCase());
        if (category) {
            setCategories(categories.map(c => c === category ? { ...c, [field]: value } : c));
        }
    };

    const deleteCategory = (name: string) => {
        setCategories(categories.filter(c => c.name !== name));
        setItems(items.map(item => item.category === name ? { ...item, category: '' } : item));
        setEditCategoryOpen(false);
    };

    const handleAddCategory = () => {
        if (categoryInput && !categories.some(c => c.name === categoryInput)) {
            setCategories([...categories, { name: categoryInput, notes: categoryNotes, enableMultiPage: enableMultiPageInput }]);
            setCategoryInput('');
            setCategoryNotes('');
            setEnableMultiPageInput(false);
            setAddCategoryOpen(false);
        }
    };

    const groupedItems = items.reduce((acc, item) => {
        const cat = item.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, Item[]>);

    const handleRowClick = (itemId: number, event: React.MouseEvent) => {
        const itemIndex = items.findIndex(item => item.id === itemId);
        if (event.shiftKey && lastSelectedIndex !== null) {
            // Range selection
            const start = Math.min(lastSelectedIndex, itemIndex);
            const end = Math.max(lastSelectedIndex, itemIndex);
            const rangeIds = items.slice(start, end + 1).map(item => item.id);
            setSelectedIds(prev => {
                const newSelection = new Set([...prev, ...rangeIds]);
                return Array.from(newSelection);
            });
        } else if (event.metaKey || event.ctrlKey) {
            // Toggle selection
            setSelectedIds(prev => 
                prev.includes(itemId) 
                    ? prev.filter(id => id !== itemId) 
                    : [...prev, itemId]
            );
            setLastSelectedIndex(itemIndex);
        } else {
            // Single selection
            setSelectedIds([itemId]);
            setLastSelectedIndex(itemIndex);
        }
    };
    const handleNamePaste = (e: React.ClipboardEvent<HTMLInputElement>, itemId: number) => {
        const text = e.clipboardData.getData('text');
        const lines = text.trim().split('\n');
        if (lines.length <= 1) return; // single line, let normal paste happen
        const headers = lines[0].split('\t').map((h: string) => h.toLowerCase().trim());
        if (headers.length < 3 || headers[0] !== 'name' || headers[1] !== 'active' || headers[2] !== 'spare') return; // not TSV, let normal
        e.preventDefault();
        const category = selectedCategory || 'Uncategorized';
        const pastedItems = lines.slice(1).filter((line: string) => line.trim()).map((line: string) => {
            const [name, active, spare] = line.split('\t');
            return {
                id: Date.now() + Math.random(),
                name: name?.trim() || '',
                category,
                active: Number(active?.trim()) || 0,
                spare: Number(spare?.trim()) || 0,
                notes: ''
            };
        });
        if (pastedItems.length === 0) return;
        // Update the current item with the first pasted item
        const firstItem = pastedItems[0];
        setItems((items: Item[]) => items.map((item: Item) => item.id === itemId ? { ...item, name: firstItem.name, active: firstItem.active, spare: firstItem.spare } : item));
        // Add the rest
        const restItems = pastedItems.slice(1);
        if (restItems.length > 0) {
            setItems((prev: Item[]) => [...prev, ...restItems]);
        }
    };

    return (
      <>
        <div className="no-print">
          <div className="bg-background border-b p-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">{coverInfo.showTitle || 'Untitled Show'}</h1>
            <Button variant="outline" size="sm" onClick={() => setEditShowOpen(true)}>
              Edit Show
            </Button>
          </div>
          <div className="p-6">
          {!selectedCategory && (
            <div className="text-sm text-muted-foreground mb-4">
              Select or create a category before adding items.
            </div>
          )}
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Item Category</TableHead>
                  <TableHead>Active Quantity</TableHead>
                  <TableHead>Spare Quantity</TableHead>
                  <TableHead>Total Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedItems).sort(([a], [b]) => a.localeCompare(b)).map(([cat, catItems]) => (
                  <React.Fragment key={cat}>
                    <TableRow>
                      <TableCell colSpan={7} className="font-bold bg-muted text-center">
                        <Button variant="ghost" className="w-full justify-center" onClick={() => { setEditCategory(cat); setLocalEnableMultiPage(getCategoryByName(cat)?.enableMultiPage || false); setEditCategoryOpen(true); }}>
                          {cat}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {catItems.map((item) => (
                      <TableRow 
                        key={item.id} 
                        onClick={(e) => handleRowClick(item.id, e)}
                        className={selectedIds.includes(item.id) ? "bg-muted" : ""}
                      >
                        <TableCell>
                          <Input
                            ref={(el) => { nameRefs.current.set(item.id, el); }}
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(item.id, "name", e.target.value)
                            }
                            onPaste={(e) => handleNamePaste(e, item.id)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Item Name"
                            className="normal-case"
                          />
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                        <Popover open={openPopoverId === item.id} onOpenChange={(open) => setOpenPopoverId(open ? item.id : null)}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              {item.category || "Uncategorized"}
                            </Button>
                          </PopoverTrigger>
                            <PopoverContent className="w-64 p-0" onClick={(e) => e.stopPropagation()}>
                              <Command>
                                <CommandInput
                                  placeholder="Type or select category..."
                                  value={categoryInput}
                                  onValueChange={setCategoryInput}
                                />
                                <CommandList>
                                  {categories.length === 0 && (
                                    <CommandEmpty>No categories found.</CommandEmpty>
                                  )}
                                  {categories.map((cat) => (
                                    <CommandItem
                                      key={cat.name}
                                      onSelect={() => handleCategorySelect(item.id, cat.name)}
                                    >
                                      {cat.name}
                                    </CommandItem>
                                  ))}
                                  {categoryInput &&
                                    !categories.some(c => c.name === categoryInput) && (
                                      <CommandItem
                                        onSelect={() => handleCategoryAdd(item.id)}
                                      >
                                        Add "{categoryInput}" as new category
                                      </CommandItem>
                                    )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Input
                            type="number"
                            min={0}
                            value={item.active === 0 ? "" : item.active}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleItemChange(
                                item.id,
                                "active",
                                val === "" ? "" : Number(val)
                              );
                            }}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                handleItemChange(item.id, "active", 0);
                              }
                            }}
                            placeholder="Active"
                          />
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Input
                            type="number"
                            min={0}
                            value={item.spare === 0 ? "" : item.spare}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleItemChange(
                                item.id,
                                "spare",
                                val === "" ? "" : Number(val)
                              );
                            }}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                handleItemChange(item.id, "spare", 0);
                              }
                            }}
                            placeholder="Spare"
                          />
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {Number(item.active) + Number(item.spare)}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={item.notes}
                            onChange={(e) =>
                              handleItemChange(item.id, "notes", e.target.value)
                            }
                            placeholder="Notes"
                            className="normal-case"
                          />
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {Object.keys(groupedItems).length > 1 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center border-dashed border-t-2">
                          <Button variant="ghost" onClick={() => handleAddRowToCategory(cat)}>
                            + Add Item to {cat}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span>{selectedIds.length} selected</span>
              <Popover open={bulkCategoryOpen} onOpenChange={setBulkCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline">Change Category</Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" onClick={(e) => e.stopPropagation()}>
                  <Command>
                    <CommandInput placeholder="Type or select category..." value={categoryInput} onValueChange={setCategoryInput} />
                    <CommandList>
                      {categories.map((cat) => (
                        <CommandItem key={cat.name} onSelect={() => {
                          setItems(items => items.map(item => selectedIds.includes(item.id) ? {...item, category: cat.name} : item));
                          setBulkCategoryOpen(false);
                          setSelectedIds([]);
                          setCategoryInput("");
                        }}>
                          {cat.name}
                        </CommandItem>
                      ))}
                      {categoryInput && !categories.some(c => c.name === categoryInput) && (
                        <CommandItem onSelect={() => {
                          setCategories([...categories, { name: categoryInput, notes: categoryNotes, enableMultiPage: false }]);
                          setItems(items => items.map(item => selectedIds.includes(item.id) ? {...item, category: categoryInput} : item));
                          setBulkCategoryOpen(false);
                          setSelectedIds([]);
                          setCategoryInput("");
                          setCategoryNotes("");
                        }}>
                          Add "{categoryInput}" as new category
                        </CommandItem>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
          <div className="mt-6">
            <Button variant="outline" onClick={() => setAddCategoryOpen(true)}>Add Category</Button>
            <Dialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit {editCategory}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label>Notes</label>
                    <Input value={getCategoryByName(editCategory!)?.notes || ""} onChange={(e) => updateCategory(editCategory!, 'notes', e.target.value)} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id={`enableMultiPage-${editCategory}`} checked={localEnableMultiPage} onChange={(e) => { const newValue = e.target.checked; setLocalEnableMultiPage(newValue); updateCategory(editCategory!, 'enableMultiPage', newValue); }} />
                    <label htmlFor={`enableMultiPage-${editCategory}`}>Enable Multi-Page Labeling</label>
                  </div>
                  <Button variant="destructive" onClick={() => deleteCategory(editCategory!)}>Delete Category</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Category Name" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} />
                  <Input placeholder="Notes" value={categoryNotes} onChange={(e) => setCategoryNotes(e.target.value)} />
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="enableMultiPageAdd" checked={enableMultiPageInput} onChange={(e) => setEnableMultiPageInput(e.target.checked)} />
                    <label htmlFor="enableMultiPageAdd">Enable Multi-Page Labeling</label>
                  </div>
                  <Button onClick={handleAddCategory}>Add</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={editShowOpen} onOpenChange={setEditShowOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Show Information</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Show Title" value={coverInfo.showTitle} onChange={(e) => setCoverInfo({ ...coverInfo, showTitle: e.target.value })} />
                  <Input placeholder="Lighting Designer" value={coverInfo.lightingDesigner} onChange={(e) => setCoverInfo({ ...coverInfo, lightingDesigner: e.target.value })} />
                  <Input placeholder="Lighting Designer Contact" value={coverInfo.lightingDesignerContact} onChange={(e) => setCoverInfo({ ...coverInfo, lightingDesignerContact: e.target.value })} />
                  <Input placeholder="Production Electrician" value={coverInfo.productionElectrician} onChange={(e) => setCoverInfo({ ...coverInfo, productionElectrician: e.target.value })} />
                  <Input placeholder="Production Electrician Contact" value={coverInfo.productionElectricianContact} onChange={(e) => setCoverInfo({ ...coverInfo, productionElectricianContact: e.target.value })} />
                  <Input placeholder="Venue Name" value={coverInfo.venueName} onChange={(e) => setCoverInfo({ ...coverInfo, venueName: e.target.value })} />
                  <Input placeholder="Venue Address" value={coverInfo.venueAddress} onChange={(e) => setCoverInfo({ ...coverInfo, venueAddress: e.target.value })} />
                  <Button onClick={() => setEditShowOpen(false)}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <Button className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0" onClick={() => window.print()}>
        <Printer />
      </Button>
      <div className="print-only" style={{display: 'none'}}>
        <div className="cover-page" style={{pageBreakAfter: 'always', textAlign: 'center', padding: '0', color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '10in'}}>
          <h1 style={{fontSize: '48px', marginBottom: '50px'}}>{coverInfo.showTitle || 'Show Title'}</h1>
          <div style={{marginBottom: '30px'}}>
            <h2 style={{fontSize: '24px'}}>Lighting Designer</h2>
            <p>{coverInfo.lightingDesigner || 'Name'}</p>
            <p>{coverInfo.lightingDesignerContact || 'Contact'}</p>
          </div>
          <div style={{marginBottom: '30px'}}>
            <h2 style={{fontSize: '24px'}}>Production Electrician</h2>
            <p>{coverInfo.productionElectrician || 'Name'}</p>
            <p>{coverInfo.productionElectricianContact || 'Contact'}</p>
          </div>
          <div>
            <h2 style={{fontSize: '24px'}}>Venue</h2>
            <p>{coverInfo.venueName || 'Venue Name'}</p>
            <p>{coverInfo.venueAddress || 'Venue Address'}</p>
          </div>
        </div>
        <div style={{marginTop: '80px', marginBottom: '60px'}}>
          {Object.entries(groupedItems).sort(([a], [b]) => a.localeCompare(b)).map(([cat, catItems]) => {
            const category = getCategoryByName(cat);
            return (
              <div key={cat}>
                <table style={{width: '100%', borderCollapse: 'collapse', color: 'black'}}>
                  <thead>
                    <tr>
                      <th colSpan={5} style={{textAlign: 'center', fontSize: '24px', border: 'none', padding: '10px'}}>{cat}{category?.enableMultiPage ? ' (cont.)' : ''}</th>
                    </tr>
                    <tr>
                      <th style={{border: '1px solid black', padding: '8px', color: 'black'}}>Item Name</th>
                      <th style={{border: '1px solid black', padding: '8px', color: 'black'}}>Active</th>
                      <th style={{border: '1px solid black', padding: '8px', color: 'black'}}>Spare</th>
                      <th style={{border: '1px solid black', padding: '8px', color: 'black'}}>Total</th>
                      <th style={{border: '1px solid black', padding: '8px', color: 'black'}}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catItems.map((item) => (
                      <tr key={item.id}>
                        <td style={{border: '1px solid black', padding: '8px', color: 'black'}}>{item.name}</td>
                        <td style={{border: '1px solid black', padding: '8px', color: 'black'}}>{item.active}</td>
                        <td style={{border: '1px solid black', padding: '8px', color: 'black'}}>{item.spare}</td>
                        <td style={{border: '1px solid black', padding: '8px', color: 'black'}}>{item.active + item.spare}</td>
                        <td style={{border: '1px solid black', padding: '8px', color: 'black'}}>{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                  {category?.enableMultiPage && (
                    <tfoot>
                      <tr>
                        <td colSpan={5} style={{textAlign: 'center', fontWeight: 'bold', border: 'none', padding: '10px'}}>CONTINUED ON NEXT PAGE</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </>

  );
}