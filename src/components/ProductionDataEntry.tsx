import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  Clock, 
  User, 
  Settings as SettingsIcon, 
  Layers, 
  Droplets, 
  Shirt,
  Calendar,
  Timer,
  Target,
  TrendingUp,
  AlertTriangle,
  Award,
  Wrench,
  Thermometer,
  Beaker,
  Zap,
  Droplet,
  Recycle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  ProductionEntry, 
  KnittingProductionEntry, 
  DyeingProductionEntry, 
  GarmentsProductionEntry,
  SHIFTS,
  QUALITY_GRADES,
  FABRIC_TYPES,
  DYE_TYPES,
  YARN_TYPES,
  GARMENT_STYLES,
  GARMENT_SIZES,
  initialKnittingEntry,
  initialDyeingEntry,
  initialGarmentsEntry
} from '../types/production';
import * as Select from '@radix-ui/react-select';

interface ProductionDataEntryProps {
  productionType: 'knitting' | 'dyeing' | 'garments';
  onSave: (entry: Omit<ProductionEntry, 'id' | 'userId' | 'timestamp'>) => void;
  editingEntry?: ProductionEntry | null;
  onCancel?: () => void;
}

export const ProductionDataEntry: React.FC<ProductionDataEntryProps> = ({
  productionType,
  onSave,
  editingEntry,
  onCancel
}) => {
  const [formData, setFormData] = useState<any>(() => {
    if (editingEntry) return editingEntry;
    
    switch (productionType) {
      case 'knitting': return initialKnittingEntry;
      case 'dyeing': return initialDyeingEntry;
      case 'garments': return initialGarmentsEntry;
      default: return initialKnittingEntry;
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingEntry) {
      setFormData(editingEntry);
    } else {
      switch (productionType) {
        case 'knitting':
          setFormData(initialKnittingEntry);
          break;
        case 'dyeing':
          setFormData(initialDyeingEntry);
          break;
        case 'garments':
          setFormData(initialGarmentsEntry);
          break;
      }
    }
    setErrors({});
  }, [productionType, editingEntry]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate total hours when start/end time changes
      if (field === 'startTime' || field === 'endTime') {
        if (newData.startTime && newData.endTime) {
          const start = new Date(`2000-01-01T${newData.startTime}`);
          const end = new Date(`2000-01-01T${newData.endTime}`);
          let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          
          // Handle overnight shifts
          if (diff < 0) {
            diff += 24;
          }
          
          newData.totalHours = Math.round(diff * 100) / 100;
        }
      }
      
      // Auto-calculate efficiency for knitting and garments
      if (productionType === 'knitting' && (field === 'targetProduction' || field === 'actualProduction')) {
        if (newData.targetProduction > 0 && newData.actualProduction >= 0) {
          newData.efficiency = Math.round((newData.actualProduction / newData.targetProduction) * 100);
        }
      } else if (productionType === 'garments' && (field === 'targetQuantity' || field === 'completedQuantity')) {
        if (newData.targetQuantity > 0 && newData.completedQuantity >= 0) {
          newData.efficiency = Math.round((newData.completedQuantity / newData.targetQuantity) * 100);
        }
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedInputChange = (parentField: string, childField: string, value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Common validations
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.shift) newErrors.shift = 'Shift is required';
    if (!formData.operator?.trim()) newErrors.operator = 'Operator name is required';
    if (!formData.supervisor?.trim()) newErrors.supervisor = 'Supervisor name is required';
    if (!formData.machineNo?.trim()) newErrors.machineNo = 'Machine number is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.qualityGrade) newErrors.qualityGrade = 'Quality grade is required';
    
    // Type-specific validations
    if (productionType === 'knitting') {
      if (!formData.fabricType?.trim()) newErrors.fabricType = 'Fabric type is required';
      if (!formData.yarnType?.trim()) newErrors.yarnType = 'Yarn type is required';
      if (formData.targetProduction <= 0) newErrors.targetProduction = 'Target production must be greater than 0';
      if (formData.actualProduction < 0) newErrors.actualProduction = 'Actual production cannot be negative';
    } else if (productionType === 'dyeing') {
      if (!formData.fabricType?.trim()) newErrors.fabricType = 'Fabric type is required';
      if (!formData.color?.trim()) newErrors.color = 'Color is required';
      if (!formData.dyeType?.trim()) newErrors.dyeType = 'Dye type is required';
      if (formData.batchWeight <= 0) newErrors.batchWeight = 'Batch weight must be greater than 0';
    } else if (productionType === 'garments') {
      if (!formData.style?.trim()) newErrors.style = 'Style is required';
      if (!formData.size?.trim()) newErrors.size = 'Size is required';
      if (!formData.color?.trim()) newErrors.color = 'Color is required';
      if (formData.targetQuantity <= 0) newErrors.targetQuantity = 'Target quantity must be greater than 0';
      if (formData.completedQuantity < 0) newErrors.completedQuantity = 'Completed quantity cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const inputClasses = "w-full rounded-lg border border-border shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground py-2 px-3 transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-foreground mb-1";
  const errorClasses = "text-red-500 text-xs mt-1";
  const selectTriggerClasses = "flex items-center justify-between w-full rounded-lg border border-border shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground py-2 px-3";

  const SelectItemContent = ({ children, value }: { children: React.ReactNode; value: string }) => (
    <Select.Item
      value={value}
      className="relative flex items-center rounded-md py-2 pl-3 pr-9 text-foreground text-sm outline-none data-[highlighted]:bg-primary/20"
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );

  const getProductionIcon = () => {
    switch (productionType) {
      case 'knitting': return <Layers className="h-6 w-6 text-white" />;
      case 'dyeing': return <Droplets className="h-6 w-6 text-white" />;
      case 'garments': return <Shirt className="h-6 w-6 text-white" />;
    }
  };

  const getProductionColor = () => {
    switch (productionType) {
      case 'knitting': return 'from-blue-500 to-blue-600';
      case 'dyeing': return 'from-purple-500 to-purple-600';
      case 'garments': return 'from-green-500 to-green-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-8 rounded-2xl border border-border shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-4 bg-gradient-to-br ${getProductionColor()} rounded-xl`}>
            {getProductionIcon()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground capitalize">
              {editingEntry ? 'Edit' : 'Add'} {productionType} Production Entry
            </h2>
            <p className="text-muted-foreground">
              Record daily production data for {productionType} operations
            </p>
          </div>
        </div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClasses}>
                <Calendar className="inline h-4 w-4 mr-1" />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={inputClasses}
              />
              {errors.date && <p className={errorClasses}>{errors.date}</p>}
            </div>

            <div>
              <label className={labelClasses}>
                <Clock className="inline h-4 w-4 mr-1" />
                Shift *
              </label>
              <Select.Root value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
                <Select.Trigger className={selectTriggerClasses}>
                  <Select.Value placeholder="Select Shift" />
                  <Select.Icon>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                    <Select.Viewport className="p-1">
                      {SHIFTS.map(shift => (
                        <SelectItemContent key={shift.value} value={shift.value}>
                          {shift.label}
                        </SelectItemContent>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              {errors.shift && <p className={errorClasses}>{errors.shift}</p>}
            </div>

            <div>
              <label className={labelClasses}>
                <User className="inline h-4 w-4 mr-1" />
                Operator *
              </label>
              <Input
                value={formData.operator}
                onChange={(e) => handleInputChange('operator', e.target.value)}
                placeholder="Operator name"
                className={inputClasses}
              />
              {errors.operator && <p className={errorClasses}>{errors.operator}</p>}
            </div>

            <div>
              <label className={labelClasses}>
                <User className="inline h-4 w-4 mr-1" />
                Supervisor *
              </label>
              <Input
                value={formData.supervisor}
                onChange={(e) => handleInputChange('supervisor', e.target.value)}
                placeholder="Supervisor name"
                className={inputClasses}
              />
              {errors.supervisor && <p className={errorClasses}>{errors.supervisor}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Machine & Timing */}
        <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-primary" />
            Machine & Timing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClasses}>
                <SettingsIcon className="inline h-4 w-4 mr-1" />
                Machine No *
              </label>
              <Input
                value={formData.machineNo}
                onChange={(e) => handleInputChange('machineNo', e.target.value)}
                placeholder="Machine number"
                className={inputClasses}
              />
              {errors.machineNo && <p className={errorClasses}>{errors.machineNo}</p>}
            </div>

            <div>
              <label className={labelClasses}>
                <Timer className="inline h-4 w-4 mr-1" />
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={inputClasses}
              />
              {errors.startTime && <p className={errorClasses}>{errors.startTime}</p>}
            </div>

            <div>
              <label className={labelClasses}>
                <Timer className="inline h-4 w-4 mr-1" />
                End Time *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={inputClasses}
              />
              {errors.endTime && <p className={errorClasses}>{errors.endTime}</p>}
            </div>

            <div>
              <label className={labelClasses}>
                <Clock className="inline h-4 w-4 mr-1" />
                Total Hours
              </label>
              <Input
                type="number"
                value={formData.totalHours}
                onChange={(e) => handleInputChange('totalHours', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                step="0.1"
                min="0"
                className={inputClasses}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Section 3: Production Specifics */}
        <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            {productionType === 'knitting' && <Layers className="h-5 w-5 mr-2 text-primary" />}
            {productionType === 'dyeing' && <Droplets className="h-5 w-5 mr-2 text-primary" />}
            {productionType === 'garments' && <Shirt className="h-5 w-5 mr-2 text-primary" />}
            Production Details
          </h3>
          
          {productionType === 'knitting' && (
            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Fabric Type *</label>
                  <Select.Root value={formData.fabricType} onValueChange={(value) => handleInputChange('fabricType', value)}>
                    <Select.Trigger className={selectTriggerClasses}>
                      <Select.Value placeholder="Select Fabric" />
                      <Select.Icon>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                        <Select.Viewport className="p-1 max-h-48 overflow-y-auto">
                          {FABRIC_TYPES.map(fabric => (
                            <SelectItemContent key={fabric} value={fabric}>{fabric}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.fabricType && <p className={errorClasses}>{errors.fabricType}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Yarn Type *</label>
                  <Select.Root value={formData.yarnType} onValueChange={(value) => handleInputChange('yarnType', value)}>
                    <Select.Trigger className={selectTriggerClasses}>
                      <Select.Value placeholder="Select Yarn" />
                      <Select.Icon>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                        <Select.Viewport className="p-1 max-h-48 overflow-y-auto">
                          {YARN_TYPES.map(yarn => (
                            <SelectItemContent key={yarn} value={yarn}>{yarn}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.yarnType && <p className={errorClasses}>{errors.yarnType}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Yarn Lot</label>
                  <Input
                    value={formData.yarnLot}
                    onChange={(e) => handleInputChange('yarnLot', e.target.value)}
                    placeholder="Yarn lot number"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Gauge</label>
                  <Input
                    value={formData.gauge}
                    onChange={(e) => handleInputChange('gauge', e.target.value)}
                    placeholder="e.g., 28GG"
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>GSM</label>
                  <Input
                    type="number"
                    value={formData.gsm}
                    onChange={(e) => handleInputChange('gsm', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Width (cm)</label>
                  <Input
                    type="number"
                    value={formData.width}
                    onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>RPM</label>
                  <Input
                    type="number"
                    value={formData.rpm}
                    onChange={(e) => handleInputChange('rpm', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Needle Breaks</label>
                  <Input
                    type="number"
                    value={formData.needleBreaks}
                    onChange={(e) => handleInputChange('needleBreaks', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          )}

          {productionType === 'dyeing' && (
            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Fabric Type *</label>
                  <Select.Root value={formData.fabricType} onValueChange={(value) => handleInputChange('fabricType', value)}>
                    <Select.Trigger className={selectTriggerClasses}>
                      <Select.Value placeholder="Select Fabric" />
                      <Select.Icon>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                        <Select.Viewport className="p-1 max-h-48 overflow-y-auto">
                          {FABRIC_TYPES.map(fabric => (
                            <SelectItemContent key={fabric} value={fabric}>{fabric}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.fabricType && <p className={errorClasses}>{errors.fabricType}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Color *</label>
                  <Input
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="Color name"
                    className={inputClasses}
                  />
                  {errors.color && <p className={errorClasses}>{errors.color}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Dye Type *</label>
                  <Select.Root value={formData.dyeType} onValueChange={(value) => handleInputChange('dyeType', value)}>
                    <Select.Trigger className={selectTriggerClasses}>
                      <Select.Value placeholder="Select Dye Type" />
                      <Select.Icon>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                        <Select.Viewport className="p-1">
                          {DYE_TYPES.map(dye => (
                            <SelectItemContent key={dye} value={dye}>{dye}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.dyeType && <p className={errorClasses}>{errors.dyeType}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Batch Weight (kg) *</label>
                  <Input
                    type="number"
                    value={formData.batchWeight}
                    onChange={(e) => handleInputChange('batchWeight', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={inputClasses}
                  />
                  {errors.batchWeight && <p className={errorClasses}>{errors.batchWeight}</p>}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Liquor Ratio</label>
                  <Input
                    type="number"
                    value={formData.liquorRatio}
                    onChange={(e) => handleInputChange('liquorRatio', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    <Thermometer className="inline h-4 w-4 mr-1" />
                    Temperature (°C)
                  </label>
                  <Input
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    <Beaker className="inline h-4 w-4 mr-1" />
                    pH Level
                  </label>
                  <Input
                    type="number"
                    value={formData.pH}
                    onChange={(e) => handleInputChange('pH', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    max="14"
                    step="0.1"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Process Time (min)</label>
                  <Input
                    type="number"
                    value={formData.processTime}
                    onChange={(e) => handleInputChange('processTime', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          )}

          {productionType === 'garments' && (
            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Style *</label>
                  <Select.Root value={formData.style} onValueChange={(value) => handleInputChange('style', value)}>
                    <Select.Trigger className={selectTriggerClasses}>
                      <Select.Value placeholder="Select Style" />
                      <Select.Icon>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                        <Select.Viewport className="p-1 max-h-48 overflow-y-auto">
                          {GARMENT_STYLES.map(style => (
                            <SelectItemContent key={style} value={style}>{style}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.style && <p className={errorClasses}>{errors.style}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Size *</label>
                  <Select.Root value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                    <Select.Trigger className={selectTriggerClasses}>
                      <Select.Value placeholder="Select Size" />
                      <Select.Icon>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                        <Select.Viewport className="p-1">
                          {GARMENT_SIZES.map(size => (
                            <SelectItemContent key={size} value={size}>{size}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.size && <p className={errorClasses}>{errors.size}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Color *</label>
                  <Input
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="Color name"
                    className={inputClasses}
                  />
                  {errors.color && <p className={errorClasses}>{errors.color}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Rework (pcs)</label>
                  <Input
                    type="number"
                    value={formData.rework}
                    onChange={(e) => handleInputChange('rework', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Production Metrics */}
        <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Production Metrics
          </h3>
          
          {productionType === 'knitting' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClasses}>
                  <Target className="inline h-4 w-4 mr-1" />
                  Target Production (kg) *
                </label>
                <Input
                  type="number"
                  value={formData.targetProduction}
                  onChange={(e) => handleInputChange('targetProduction', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={inputClasses}
                />
                {errors.targetProduction && <p className={errorClasses}>{errors.targetProduction}</p>}
              </div>

              <div>
                <label className={labelClasses}>
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  Actual Production (kg) *
                </label>
                <Input
                  type="number"
                  value={formData.actualProduction}
                  onChange={(e) => handleInputChange('actualProduction', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={inputClasses}
                />
                {errors.actualProduction && <p className={errorClasses}>{errors.actualProduction}</p>}
              </div>

              <div>
                <label className={labelClasses}>
                  <Award className="inline h-4 w-4 mr-1" />
                  Efficiency (%)
                </label>
                <Input
                  type="number"
                  value={formData.efficiency}
                  onChange={(e) => handleInputChange('efficiency', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  max="200"
                  className={inputClasses}
                  readOnly
                />
              </div>

              <div>
                <label className={labelClasses}>
                  <Award className="inline h-4 w-4 mr-1" />
                  Quality Grade *
                </label>
                <Select.Root value={formData.qualityGrade} onValueChange={(value) => handleInputChange('qualityGrade', value)}>
                  <Select.Trigger className={selectTriggerClasses}>
                    <Select.Value placeholder="Select Grade" />
                    <Select.Icon>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                      <Select.Viewport className="p-1">
                        {QUALITY_GRADES.map(grade => (
                          <SelectItemContent key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItemContent>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                {errors.qualityGrade && <p className={errorClasses}>{errors.qualityGrade}</p>}
              </div>
            </div>
          )}

          {productionType === 'dyeing' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClasses}>
                  <Droplet className="inline h-4 w-4 mr-1" />
                  Water Consumption (L)
                </label>
                <Input
                  type="number"
                  value={formData.waterConsumption}
                  onChange={(e) => handleInputChange('waterConsumption', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  <Zap className="inline h-4 w-4 mr-1" />
                  Energy Consumption (kWh)
                </label>
                <Input
                  type="number"
                  value={formData.energyConsumption}
                  onChange={(e) => handleInputChange('energyConsumption', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  <Recycle className="inline h-4 w-4 mr-1" />
                  Waste Generated (kg)
                </label>
                <Input
                  type="number"
                  value={formData.wasteGenerated}
                  onChange={(e) => handleInputChange('wasteGenerated', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  <Award className="inline h-4 w-4 mr-1" />
                  Quality Grade *
                </label>
                <Select.Root value={formData.qualityGrade} onValueChange={(value) => handleInputChange('qualityGrade', value)}>
                  <Select.Trigger className={selectTriggerClasses}>
                    <Select.Value placeholder="Select Grade" />
                    <Select.Icon>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                      <Select.Viewport className="p-1">
                        {QUALITY_GRADES.map(grade => (
                          <SelectItemContent key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItemContent>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                {errors.qualityGrade && <p className={errorClasses}>{errors.qualityGrade}</p>}
              </div>
            </div>
          )}

          {productionType === 'garments' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClasses}>
                  <Target className="inline h-4 w-4 mr-1" />
                  Target Quantity (pcs) *
                </label>
                <Input
                  type="number"
                  value={formData.targetQuantity}
                  onChange={(e) => handleInputChange('targetQuantity', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  className={inputClasses}
                />
                {errors.targetQuantity && <p className={errorClasses}>{errors.targetQuantity}</p>}
              </div>

              <div>
                <label className={labelClasses}>
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  Completed Quantity (pcs) *
                </label>
                <Input
                  type="number"
                  value={formData.completedQuantity}
                  onChange={(e) => handleInputChange('completedQuantity', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  className={inputClasses}
                />
                {errors.completedQuantity && <p className={errorClasses}>{errors.completedQuantity}</p>}
              </div>

              <div>
                <label className={labelClasses}>
                  <Award className="inline h-4 w-4 mr-1" />
                  Efficiency (%)
                </label>
                <Input
                  type="number"
                  value={formData.efficiency}
                  onChange={(e) => handleInputChange('efficiency', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  max="200"
                  className={inputClasses}
                  readOnly
                />
              </div>

              <div>
                <label className={labelClasses}>
                  <Award className="inline h-4 w-4 mr-1" />
                  Quality Grade *
                </label>
                <Select.Root value={formData.qualityGrade} onValueChange={(value) => handleInputChange('qualityGrade', value)}>
                  <Select.Trigger className={selectTriggerClasses}>
                    <Select.Value placeholder="Select Grade" />
                    <Select.Icon>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                      <Select.Viewport className="p-1">
                        {QUALITY_GRADES.map(grade => (
                          <SelectItemContent key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItemContent>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                {errors.qualityGrade && <p className={errorClasses}>{errors.qualityGrade}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Defects & Quality (for knitting and garments) */}
        {(productionType === 'knitting' || productionType === 'garments') && (
          <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Defects & Quality Control
            </h3>
            
            {productionType === 'knitting' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Holes</label>
                  <Input
                    type="number"
                    value={formData.defects?.holes || 0}
                    onChange={(e) => handleNestedInputChange('defects', 'holes', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Drop Stitches</label>
                  <Input
                    type="number"
                    value={formData.defects?.dropStitches || 0}
                    onChange={(e) => handleNestedInputChange('defects', 'dropStitches', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Yarn Breaks</label>
                  <Input
                    type="number"
                    value={formData.defects?.yarnBreaks || 0}
                    onChange={(e) => handleNestedInputChange('defects', 'yarnBreaks', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Other Defects</label>
                  <Input
                    type="number"
                    value={formData.defects?.other || 0}
                    onChange={(e) => handleNestedInputChange('defects', 'other', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                  />
                </div>
              </div>
            )}

            {productionType === 'garments' && (
              <div className="space-y-6">
                {/* Defects Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClasses}>Stitching Defects</label>
                    <Input
                      type="number"
                      value={formData.defects?.stitchingDefects || 0}
                      onChange={(e) => handleNestedInputChange('defects', 'stitchingDefects', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Measurement Defects</label>
                    <Input
                      type="number"
                      value={formData.defects?.measurementDefects || 0}
                      onChange={(e) => handleNestedInputChange('defects', 'measurementDefects', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Fabric Defects</label>
                    <Input
                      type="number"
                      value={formData.defects?.fabricDefects || 0}
                      onChange={(e) => handleNestedInputChange('defects', 'fabricDefects', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Other Defects</label>
                    <Input
                      type="number"
                      value={formData.defects?.other || 0}
                      onChange={(e) => handleNestedInputChange('defects', 'other', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Operations Row */}
                <div>
                  <h4 className="text-md font-medium text-foreground mb-3">Operations Completed</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className={labelClasses}>Cutting (pcs)</label>
                      <Input
                        type="number"
                        value={formData.operations?.cutting || 0}
                        onChange={(e) => handleNestedInputChange('operations', 'cutting', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Sewing (pcs)</label>
                      <Input
                        type="number"
                        value={formData.operations?.sewing || 0}
                        onChange={(e) => handleNestedInputChange('operations', 'sewing', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Finishing (pcs)</label>
                      <Input
                        type="number"
                        value={formData.operations?.finishing || 0}
                        onChange={(e) => handleNestedInputChange('operations', 'finishing', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        className={inputClasses}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Packing (pcs)</label>
                      <Input
                        type="number"
                        value={formData.operations?.packing || 0}
                        onChange={(e) => handleNestedInputChange('operations', 'packing', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 6: Chemical Consumption (for dyeing only) */}
        {productionType === 'dyeing' && (
          <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Beaker className="h-5 w-5 mr-2 text-purple-500" />
              Chemical Consumption & Quality Results
            </h3>
            
            <div className="space-y-6">
              {/* Chemical Consumption Row */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-3">Chemical Consumption (kg)</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClasses}>Dyes</label>
                    <Input
                      type="number"
                      value={formData.chemicalConsumption?.dyes || 0}
                      onChange={(e) => handleNestedInputChange('chemicalConsumption', 'dyes', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Salt</label>
                    <Input
                      type="number"
                      value={formData.chemicalConsumption?.salt || 0}
                      onChange={(e) => handleNestedInputChange('chemicalConsumption', 'salt', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Soda</label>
                    <Input
                      type="number"
                      value={formData.chemicalConsumption?.soda || 0}
                      onChange={(e) => handleNestedInputChange('chemicalConsumption', 'soda', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Auxiliaries</label>
                    <Input
                      type="number"
                      value={formData.chemicalConsumption?.auxiliaries || 0}
                      onChange={(e) => handleNestedInputChange('chemicalConsumption', 'auxiliaries', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              {/* Quality Results Row */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-3">Quality Assessment</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClasses}>Color Match</label>
                    <Select.Root 
                      value={formData.qualityResults?.colorMatch || 'excellent'} 
                      onValueChange={(value) => handleNestedInputChange('qualityResults', 'colorMatch', value)}
                    >
                      <Select.Trigger className={selectTriggerClasses}>
                        <Select.Value />
                        <Select.Icon>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                          <Select.Viewport className="p-1">
                            <SelectItemContent value="excellent">Excellent</SelectItemContent>
                            <SelectItemContent value="good">Good</SelectItemContent>
                            <SelectItemContent value="acceptable">Acceptable</SelectItemContent>
                            <SelectItemContent value="poor">Poor</SelectItemContent>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  <div>
                    <label className={labelClasses}>Fastness</label>
                    <Select.Root 
                      value={formData.qualityResults?.fastness || 'excellent'} 
                      onValueChange={(value) => handleNestedInputChange('qualityResults', 'fastness', value)}
                    >
                      <Select.Trigger className={selectTriggerClasses}>
                        <Select.Value />
                        <Select.Icon>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                          <Select.Viewport className="p-1">
                            <SelectItemContent value="excellent">Excellent</SelectItemContent>
                            <SelectItemContent value="good">Good</SelectItemContent>
                            <SelectItemContent value="acceptable">Acceptable</SelectItemContent>
                            <SelectItemContent value="poor">Poor</SelectItemContent>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  <div>
                    <label className={labelClasses}>Uniformity</label>
                    <Select.Root 
                      value={formData.qualityResults?.uniformity || 'excellent'} 
                      onValueChange={(value) => handleNestedInputChange('qualityResults', 'uniformity', value)}
                    >
                      <Select.Trigger className={selectTriggerClasses}>
                        <Select.Value />
                        <Select.Icon>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="overflow-hidden rounded-lg bg-card border border-border shadow-lg z-50">
                          <Select.Viewport className="p-1">
                            <SelectItemContent value="excellent">Excellent</SelectItemContent>
                            <SelectItemContent value="good">Good</SelectItemContent>
                            <SelectItemContent value="acceptable">Acceptable</SelectItemContent>
                            <SelectItemContent value="poor">Poor</SelectItemContent>
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>

                  <div>
                    <label className={labelClasses}>Overall Grade</label>
                    <div className="mt-1 p-2 bg-muted/30 rounded-lg border border-border">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        formData.qualityGrade === 'A' ? 'bg-green-100 text-green-800' :
                        formData.qualityGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                        formData.qualityGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Grade {formData.qualityGrade}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {productionType === 'garments' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClasses}>Stitching Defects</label>
                    <Input
                      type="number"
                      value={formData.defects?.stitchingDefects || 0}
                      onChange={(e) => handleNestedInputChange('defects', 'stitchingDefects', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Measurement Defects</label>
                    <Input
                      type="number"
                      value={formData.defects?.measurementDefects || 0}
                      onChange={(e) => handleNestedInputChange('defects', 'measurementDefects', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Fabric Defects</label>
                    <Input
                      type="number"
                      value={formData.defects?.fabricDefects || 0}
                      onChange={(e) => handleNestedInputChange('defects', 'fabricDefects', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Other Defects</label>
                    <Input
                      type="number"
                      value={formData.defects?.other || 0}
                      onChange={(e) => handleNestedInputChange('defects', 'other', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className={inputClasses}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Section 7: Additional Notes */}
        <div className="bg-muted/20 p-6 rounded-xl border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Additional Notes</h3>
          <div>
            <label className={labelClasses}>Production Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes about this production entry..."
              className={`${inputClasses} min-h-[100px] resize-none`}
              rows={4}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t border-border">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            <Save className="h-4 w-4 mr-2" />
            {editingEntry ? 'Update Entry' : 'Save Entry'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};